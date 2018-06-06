var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    ec2: '2016-11-15',
    sqs: '2012-11-05',
};

var ec2 = new AWS.EC2();
var sqs = new AWS.SQS();

exports.handler = function(event) {
    var pull_request = event["pull_request"];
    
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
        MessageBody: "New " + pull_request["head"]["sha"],
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
        } else {
            console.log("Success", data.MessageId);
        }
    });
};
