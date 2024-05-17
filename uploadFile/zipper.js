const AWS = require("aws-sdk");
const s3Zip = require("./s3-zipmodule");
const common = require("../config/common");

module.exports.handler = function (event, context) {
  const region = "ap-northeast-2";
  const { serviceType } = event.queryStringParameters;
  const zipFileName = ".zip";
  let originalName = [];
  let files = [];
  let userId;
  let folder;
  if (event.body) {
    let body = JSON.parse(event.body);
    userId = body.userId;
    folder = body.folder;
    files = body.files;
    originalName = body.originalName;
  } else {
    context.fail("No Body");
  }

  // Create body stream
  try {
    if (serviceType == common.serviceType.HSM) {
      var bucket = "housemanager-file-storage-" + common.stageType.DEV;
    } else if (serviceType == common.serviceType.AON) {
      var bucket = "aon-file-storage-" + common.stageType.DEV;
    }
    const body = s3Zip.archive(
      { region: region, bucket: bucket },
      `${userId}/${folder}`,
      files,
      originalName
    );
    const zipParams = {
      params: {
        Bucket: bucket,
        Key: `${userId}/${folder}/${folder + zipFileName}`,
      },
    };
    const zipFile = new AWS.S3(zipParams);
    zipFile
      .upload({ Body: body })
      .on("httpUploadProgress", function (evt) {})
      .send(function (e, r) {
        if (e) {
          const err = "zipFile.upload error " + e;
          context.fail(err);
        }
        const signedUrl = zipFile.getSignedUrl("getObject", {
          Bucket: bucket,
          Key: `${userId}/${folder}/${folder + zipFileName}`,
          Expires: 60000,
        });
        const response = {
          statusCode: 200,
          body: JSON.stringify({ message: signedUrl }),
        };
        context.succeed(response);
      });
  } catch (e) {
    const err = "catched error: " + e;
    context.fail(err);
  }
};
