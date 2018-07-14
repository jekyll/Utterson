var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    ec2: '2016-11-15',
    sqs: '2012-11-05',
};

var ec2 = new AWS.EC2();
var sqs = new AWS.SQS();

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

        var title = "New PR #" + pull_request["number"] +
            "\nwith base " + pull_request["base"]["ref"] +
            "\nand head " + pull_request["head"]["sha"];

        var params = {
            InstanceIds: [
                process.env["INSTANCE_ID"],
            ]
        };

        var message = {
            MessageBody: title,
            QueueUrl: process.env["QUEUE_URL"],
            MessageGroupId: "0",
            MessageAttributes: {
                "pr": {
                    DataType: "String",
                    StringValue: String(pull_request["number"])
                },
                "base": {
                    DataType: "String",
                    StringValue: pull_request["base"]["ref"]
                },
                "base-sha": {
                    DataType: "String",
                    StringValue: pull_request["base"]["sha"]
                },
                "head": {
                    DataType: "String",
                    StringValue: pull_request["head"]["sha"]
                },
                "head-branch": {
                    DataType: "String",
                    StringValue: pull_request["head"]["ref"]
                },
                "repo": {
                    DataType: "String",
                    StringValue: json["repository"]["clone_url"]
                },
                "installation": {
                    DataType: "String",
                    StringValue: String(json["installation"]["id"])
                },
                "url": {
                    DataType: "String",
                    StringValue: pull_request["base"]["repo"]["url"]
                },
            }
        };
        response.body = JSON.stringify(message, null, 2);

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

        await new Promise((resolve, reject) => {
            ec2.startInstances(params, function(err, data) {
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
