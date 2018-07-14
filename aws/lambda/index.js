var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    ec2: '2016-11-15',
    sqs: '2012-11-05',
};

var ec2 = new AWS.EC2();
var sqs = new AWS.SQS();

const PARAMS = {
    InstanceIds: [
        process.env["INSTANCE_ID"],
    ]
};
const QUEUE_URL = process.env["QUEUE_URL"];

const enqueuePullRequest = function(pr, installation) {
    const title = "New PR #" + pr["number"] +
        "\nwith base " + pr["base"]["ref"] +
        "\nand head " + pr["head"]["sha"];

    const cloneUrl = pr["base"]["repo"]["url"].replace("https://api.github.com/repos", "https://github.com");

    const message = {
        MessageBody: title,
        QueueUrl: QUEUE_URL,
        MessageGroupId: "0",
        MessageAttributes: {
            "pr": {
                DataType: "String",
                StringValue: String(pr["number"])
            },
            "base": {
                DataType: "String",
                StringValue: pr["base"]["ref"]
            },
            "base-sha": {
                DataType: "String",
                StringValue: pr["base"]["sha"]
            },
            "head": {
                DataType: "String",
                StringValue: pr["head"]["sha"]
            },
            "head-branch": {
                DataType: "String",
                StringValue: pr["head"]["ref"]
            },
            "repo": {
                DataType: "String",
                StringValue: cloneUrl
            },
            "installation": {
                DataType: "String",
                StringValue: installation
            },
            "url": {
                DataType: "String",
                StringValue: pr["base"]["repo"]["url"]
            },
        }
    };

    await new Promise((resolve, reject) => {
        sqs.sendMessage(message, function(err, data) {
            if (err) {
                console.log("Error", err);
            }
            else {
                console.log("SQS Success");
            }
            resolve();
        });
    });

    return message;
}

exports.handler = async function(event, context) {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        var response = {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": {},
            "body": ""
        };

        var json = event.body;
        if (typeof json === "string") {
            json = JSON.parse(json);
        }

        if (json["action"] === "created" || "zen" in json) {
            response["body"] = "ok";
            context.succeed(response);
            return;
        }

        const INSTALLATION = String(json["installation"]["id"]);

        let pull_requests;
        if ("pull_requests" in json) {
            pull_requests = json["check_suite"]["pull_requests"];
        }
        else if ("pull_request" in json) {
            pull_requests = [json["pull_request"]];
        }
        else {
            response.statusCode = 500;
            response.body = "No pull requests present";
            context.succeed(response);
            return;
        }

        const pull_request = pull_requests[0];

        const message = enqueuePullRequest(pull_request, INSTALLATION);
        response.body = JSON.stringify(message, null, 2);

        await new Promise((resolve, reject) => {
            ec2.startInstances(PARAMS, function(err, data) {
                if (err) {
                    console.log("Error", err);
                }
                else {
                    console.log("EC2 Success");
                }
                resolve();
            });
        });

        context.succeed(response);
    }
    catch (err) {
        response.statusCode = 500;
        response.body = err.message + "\n\n" + JSON.stringify(event.body);
        context.succeed(response);
    }
};
