"use strict";
const AWS = require("aws-sdk");
const coolsms = require("coolsms-node-sdk").default;
const messageService = new coolsms(
  "",
  ""
);
AWS.config.update({ region: "ap-northeast-2" });

module.exports.handler = (event) => {
  try {
    const { Records } = event;
    const body = JSON.parse(Records[0].body);

    const productionCompany = body.MessageAttributes.productionCompany.Value;
    const userName = body.MessageAttributes.userName.Value;
    const userPhone = body.MessageAttributes.userPhone.Value;
    const address = body.MessageAttributes.address.Value;
    const productionType = body.MessageAttributes.productionType.Value;

    if (body.MessageAttributes.kakaoType.Value === "Value1") {
      messageService
        .sendOne({
          to: userPhone,
          from: "",
          kakaoOptions: {
            pfId: "",
            templateId: "",
          },
          text: "",
        })
        .then((res) => console.log(res));
    } else if (body.MessageAttributes.kakaoType.Value === "Value2") {
      messageService
        .sendOne({
          to: userPhone,
          from: "",
          kakaoOptions: {
            pfId: "",
            templateId: "",
            variables: {
              "#{이름}": userName,
              "#{업체명}": productionCompany,
            },
          },
          text: "",
        })
        .then((res) => console.log(res));
    } else if (body.MessageAttributes.kakaoType.Value === "Value3") {
      messageService
        .sendOne({
          to: userPhone,
          from: "",
          kakaoOptions: {
            pfId: "",
            templateId: "",
            variables: {
              "#{이름}": userName,
              "#{주소}": address,
              "#{신청 내역}": productionType,
            },
          },
          text: "",
        })
        .then((res) => console.log(res));
    }

    console.log("Incoming message body from SQS :", body);
  } catch (error) {
    console.error("Error in executing lambda handler for SQS", error);
    return;
  }
};
