const stream = require("stream");
const AWS = require("aws-sdk");
const service1 = "service1";
const service2 = "service2";
const stage = "dev";
const REGION = "ap-northeast-2";
const S3 = new AWS.S3();
const sharp = require("sharp");

// create constants

const supportImageTypes = [
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
  "heic",
];

module.exports.handler = async (event) => {
  if (event.body) {
    let body = JSON.parse(event.body);
    userId = body.userId;
    imageName = body.imageName;
  } else {
    context.fail("No Body");
  }
  const { w, h, e: extension, serviceType } = event.queryStringParameters;

  let BUCKET;
  if (serviceType === service2) {
    BUCKET = "housemanager-image-storage-" + stage;
  } else if (serviceType === service1) {
    BUCKET = "service1-image-storage-" + stage;
  }

  if (!supportImageTypes.includes(extension)) {
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
  const width = parseInt(w);
  const height = parseInt(h);
  const originalKey = userId + "/" + imageName;
  const URL = `http://${BUCKET}.s3-website.${REGION}.amazonaws.com`;
  let offset = new Date().getTimezoneOffset() * 60000; //대한민국의 offset 을 수동으로 추가
  let dateOffset = new Date(Date.now() - offset); //  2022-03-13T17:17:29.227Z
  const ISODate = dateOffset.toISOString().substring(0, 10); // '2022-03-13'
  const uid = parseInt(Math.random() * 10000000);
  const resizeKey =
    `${userId}/` +
    "" +
    width +
    "x" +
    height +
    "/" +
    `${ISODate}_images_${uid}.${extension}`;
  // create the new name of the image, note this has a '/' - S3 will create a directory

  const signedOriginalUrl = S3.getSignedUrl("getObject", {
    Bucket: BUCKET,
    Key: resizeKey,
    Expires: 60000,
  });
  try {
    // create the read and write streams from and to S3 and the Sharp resize stream
    const readStream = readStreamFromS3({
      Bucket: BUCKET,
      Key: originalKey,
    });
    const resizeStream = streamToSharp({ width, height, extension });
    const { writeStream, uploadFinished } = writeStreamToS3({
      Bucket: BUCKET,
      Key: resizeKey,
    });

    // trigger the stream
    readStream.pipe(resizeStream).pipe(writeStream);

    // wait for the stream to finish
    const uploadedData = await uploadFinished;

    // log data to Dashbird
    console.log("Data: ", {
      ...uploadedData,
      BucketEndpoint: URL,
      ImageURL: signedOriginalUrl,
    });

    return {
      statusCode: "200",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        bucket: BUCKET,
        resizeKey: resizeKey,
        resizeUrl: signedOriginalUrl,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: "500",
      body: err.message,
    };
  }
};
// create the read stream abstraction for downloading data from S3
const readStreamFromS3 = ({ Bucket, Key }) => {
  return S3.getObject({ Bucket, Key }).createReadStream();
};
// create the write stream abstraction for uploading data to S3
const writeStreamToS3 = ({ Bucket, Key, extension }) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    uploadFinished: S3.upload({
      Body: pass,
      Bucket,
      ContentType: `image/${extension}`,
      Key,
    }).promise(),
  };
};
// sharp resize stream
const streamToSharp = ({ width, height, extension }) => {
  return sharp().resize(width, height).toFormat(extension);
};
