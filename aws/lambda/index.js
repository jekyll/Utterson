var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    ec2: '2016-11-15',
    sqs: '2012-11-05',
};

var ec2 = new AWS.EC2();
var sqs = new AWS.SQS();

exports.handler = function(event, context) {
    try {
        var response = {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": {},
            "body": ""
        }

        var json = event.body;
        if (typeof json === "string") {
            json = JSON.parse(json)
        }
        
        var pull_request = json["pull_request"];

        var title = "New PR #" + pull_request["number"] +
            "\nwith base " + pull_request["base"]["ref"] +
            "\nand head " + pull_request["head"]["sha"];

        response.body = title;

        var params = {
            InstanceIds: [
                process.env["INSTANCE_ID"],
            ]
        };
        ec2.startInstances(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            }
        });

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
            }
        }
        sqs.sendMessage(message, function(err, data) {
            if (err) {
                console.log("Error", err);
            }
            else {
                console.log("Success", data.MessageId);
            }
        });

        context.succeed(response);
    }
    catch (err) {
        response.statusCode = 500;
        response.body = err.message+"\n\n"+JSON.stringify(event.body);
        context.succeed(response);
    }
};
