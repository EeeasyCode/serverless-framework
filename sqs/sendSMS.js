"use strict";
const AWS = require("aws-sdk");
const coolsms = require("node-coolsms");
AWS.config.update({ region: "ap-northeast-2" });

module.exports.handler = (event) => {
  try {
    const { Records } = event;

    const body = JSON.parse(Records[0].body);

    console.log("Incoming message body from SQS :", body);

    coolsms.init({
      secret: "",
      key: "",
    });
    if (
      body.MessageAttributes.queue.Value === "ALL" ||
      body.MessageAttributes.queue.Value === "SMS"
    ) {
      // 단일 발송 예제
      coolsms.balance(function (err, result) {
        console.log("result err=%s, result", err, result);
      });

      coolsms.send(
        {
          to: "",
          from: "",
          type: "SMS",
          text: body.Message,
        },
        function (err, result) {
          console.log("result err=%s, result", err, result);
        }
      );
      console.log("Successfully send SMS");
    }
  } catch (error) {
    console.error("Error in executing lambda handler for SQS", error);
    return;
  }
};
