const MAX_FILES = 5000000;
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const formParser = require("./formParser");
const common = require("../config/common");

let supportFileTypes = [
  "txt",
  "ppt",
  "pptx",
  "hwp",
  "docx",
  "pdf",
  "xlsx",
  "jpg",
  "jpeg",
  "bmp",
  "gif",
  "png",
];

const uploadFile = async (
  file,
  uploadPath,
  bucket,
  supportFileTypes,
  MAX_SIZE
) => {
  let offset = new Date().getTimezoneOffset() * 60000; //대한민국의 offset 을 수동으로 추가
  let dateOffset = new Date(Date.now() - offset); //  2022-03-13T17:17:29.227Z
  const ISODate = dateOffset.toISOString().substring(0, 10); // '2022-03-13'
  const uid = parseInt(Math.random() * 10000000);
  const originalFormat = file.filename.match(/(.*)\.(.*)/)[2].toLowerCase();
  const originalName = file.filename;

  if (!supportFileTypes.includes(originalFormat)) {
    return Promise.reject({
      error: `${originalFormat} is not supported file type`,
    });
  }

  if (file.content.length > MAX_SIZE) {
    return Promise.reject({
      error: "file size too long",
    });
  }

  const originalKey = `${uploadPath}/${ISODate}_${uid}.${originalFormat}`;

  const originalFile = await uploadToS3(
    bucket,
    originalKey,
    file.content,
    file.contentType + "; charset=utf-8"
  );

  return {
    bucket: bucket,
    mimeType: file.contentType + "; charset=utf-8",
    s3FileName: `${ISODate}_${uid}.${originalFormat}`,
    originalName: originalName,
    originalUrl: originalFile.Location,
    fileSize: file.content.length,
  };
};
// .txt, .ppt, .pptx, .hwp, .docs, .pdf, .xlsx, .docx, .jpg, .jpeg, .bmp, .gif, .png

module.exports.handler = async (event) => {
  const { userId, folder, serviceType, size, accept } =
    event.queryStringParameters;

  const acceptArr = accept.split(" ");
  const extentionArr = [];
  const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
  acceptArr.forEach((element) => {
    extentionArr.push(element.replace(reg, ""));
  });
  extentionArr.sort();
  supportFileTypes.sort();
  if (!(JSON.stringify(supportFileTypes) === JSON.stringify(extentionArr))) {
    supportFileTypes = [...extentionArr];
    console.log(supportFileTypes);
  }

  if (!userId || !folder || !serviceType) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "check queryString",
      }),
    };
  }
  let bucket;
  let MAX_SIZE;
  if (serviceType == common.serviceType.service2) {
    bucket = "housemanager-file-storage-" + common.stageType.DEV;
    MAX_SIZE = size;
  } else if (serviceType == common.serviceType.service1) {
    bucket = "service1-file-storage-" + common.stageType.DEV;
    MAX_SIZE = size;
  }

  const uploadPath = `${userId}/${folder}`;
  const formData = await formParser.parser(event, MAX_SIZE, MAX_FILES);

  const fileUploads = formData.files.map((file) =>
    uploadFile(file, uploadPath, bucket, supportFileTypes, MAX_SIZE)
  );

  try {
    const response = await Promise.allSettled(fileUploads);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify(response),
    };
  } catch (err) {
    return getErrorMessage(err.message);
  }
};
const getErrorMessage = (message) => ({
  statusCode: 500,
  body: JSON.stringify(message),
});
const uploadToS3 = (bucket, key, buffer, mimeType) =>
  new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      },
      function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
