var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    ec2: '2016-11-15',
    sqs: '2012-11-05',
};

var ec2 = new AWS.EC2();
var sqs = new AWS.SQS();

exports.handler = function(event) {
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
        MessageBody: "New " + Date.now(),
        QueueUrl: process.env["QUEUE_URL"],
        MessageGroupId: "0",
        MessageAttributes: {
            "pr": {
                DataType: "String",
                StringValue: "7049"
            },
            "base": {
                DataType: "String",
                StringValue: "master"
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
