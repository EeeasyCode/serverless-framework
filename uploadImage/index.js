"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const formParser = require("./formParser");

const service1 = "service1";
const service2 = "service2";
const sharp = require("sharp");
const QUALITY = 70;

var supportImageTypes = [
  "jpg",
  "JPG",
  "jpeg",
  "JPEG",
  "bmp",
  "BMP",
  "gif",
  "GIF",
  "png",
  "PNG",
];
// 확장자 화이트리스트 배열로 넘겨받기 (프론트단)
module.exports.handler = async (event) => {
  const { serviceType, userId, folder, size, accept } =
    event.queryStringParameters;
  if (!(serviceType && userId && folder)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "check queryString",
      }),
    };
  }
  let MAX_SIZE = 4000000;
  if (size) {
    MAX_SIZE = size;
  }
  console.log(MAX_SIZE);
  const formData = await formParser.parser(event, MAX_SIZE);
  const file = formData.files[0];

  if (file.content.length > MAX_SIZE) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "check file size",
      }),
    };
  }
  let offset = new Date().getTimezoneOffset() * 60000; //대한민국의 offset 을 수동으로 추가
  let dateOffset = new Date(Date.now() - offset); //  2022-03-13T17:17:29.227Z
  const ISODate = dateOffset.toISOString().substring(0, 10); // '2022-03-13'
  const uid = parseInt(Math.random() * 10000000);

  const acceptArr = accept.split(" ");
  const extentionArr = [];
  const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
  acceptArr.forEach((element) => {
    extentionArr.push(element.replace(reg, ""));
  });
  extentionArr.sort();
  supportImageTypes.sort();
  if (!(JSON.stringify(supportImageTypes) === JSON.stringify(extentionArr))) {
    supportImageTypes = [...extentionArr];
    console.log(supportImageTypes);
  }

  const savedPath = `${userId}/${folder}/${ISODate}_partners_${uid}.webp`;
  const savedFileName = `${ISODate}_partners_${uid}.webp`;
  let originalFormat = file.filename.match(/(.*)\.(.*)/)[2].toLowerCase();
  let bucket;

  if (serviceType === service2) {
    bucket = "housemanager-image-storage-dev";
  } else if (serviceType === service1) {
    bucket = "service1-image-storage-dev";
  }

  if (!supportImageTypes.includes(originalFormat)) {
    return {
      statusCode: 403,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Unsupported image type",
      }),
    };
  }

  try {
    let sharpImageBuffer = null;
    sharpImageBuffer = await sharp(file.content)
      .webp({ quality: +QUALITY })
      .toBuffer();

    const originalFile = await uploadToS3(
      bucket,
      savedPath,
      sharpImageBuffer,
      "image/webp"
    );
    const signedOriginalUrl = s3.getSignedUrl("getObject", {
      Bucket: originalFile.Bucket,
      Key: savedPath,
      Expires: 60000,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        bucket: bucket,
        mimeType: file.contentType,
        savedPath: savedPath,
        savedFileName: savedFileName,
        originalUrl: signedOriginalUrl,
      }),
    };
  } catch (e) {
    return getErrorMessage(e.message);
  }
};

const getErrorMessage = (message) => ({
  statusCode: 500,
  body: JSON.stringify(message),
});

const uploadToS3 = (bucket, key, buffer, mimeType) =>
  new Promise((resolve, reject) => {
    s3.upload(
      { Bucket: bucket, Key: key, Body: buffer, ContentType: mimeType },
      function (err, data) {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
