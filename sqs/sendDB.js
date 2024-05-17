"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "ap-northeast-2" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const { Records } = event;

    const body = JSON.parse(Records[0].body);

    const params = {
      TableName: "notifications",
      Item: {
        createdAt: body.MessageAttributes.createdAt.Value,
        userInfo: body.MessageAttributes.userMail.Value,
        subject: body.Subject,
        message: body.Message,
        queueType: body.MessageAttributes.queueType.Value,
        sendStatus: body.MessageAttributes.sendStatus.Value,
      },
    };

    await dynamoDB.put(params).promise();

    console.log(
      "Successfully written to DynamoDB" +
        "  /  " +
        body.MessageAttributes.createdAt.Value
    );
  } catch (error) {
    //error handling
    console.error("Error in executing lambda handler for SQS", error);
    return;
  }
};
