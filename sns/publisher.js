"use strict";

const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-northeast-2" });
const sns = new AWS.SNS({ region: "ap-northeast-2" });

const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

module.exports.handler = async (event, context) => {
  console.log(event);
  const body = JSON.parse(event.body);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const day = dayjs(new Date()).tz("Asia/Seoul");
  const createdAt = day.format("YYYY-MM-DD HH:mm:ss").toString();
  console.log("날짜 시간: " + createdAt);
  const publishemdmessage = await sns
    .publish({
      Subject: body.subject,
      Message: body.message,
      MessageAttributes: {
        createdAt: {
          DataType: "String",
          StringValue: createdAt,
        },
        userName: {
          DataType: "String",
          StringValue: body.userName,
        },
        userPhone: {
          DataType: "String",
          StringValue: body.userPhone,
        },
        productionCompany: {
          DataType: "String",
          StringValue: body.productionCompany,
        },
        productionType: {
          DataType: "String",
          StringValue: body.productionType,
        },
        address: {
          DataType: "String",
          StringValue: body.address,
        },
        kakaoType: {
          DataType: "String",
          StringValue: body.kakaoType,
        },
      },
      TopicArn: "arn:aws:sns:ap-northeast-2:427390360776:sns-topic-dev",
    })
    .promise();
  console.log(publishemdmessage);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        status: "success",
        message: publishemdmessage,
      },
      null,
      2
    ),
  };
};
