# Lambda Function

This Lambda function needs two environment variables set:

  * `QUEUE_URL`: The SQS Queue where build requests will be sent
  * `INSTANCE_ID`: The EC2 instance where builds will run
