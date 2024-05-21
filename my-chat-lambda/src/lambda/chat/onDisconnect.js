
const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { handleHttpRequest } = require('slsberry');
var ddbUtil = require("../lib/ddbUtilv3");
const apiSpec = {
  category: 'chat',
  event: [
    {
      type: 'websocket',
      method: 'websocket',
      route: '$disconnect',
    },
  ],
  desc: '웹소캣 Disconnect 처리.',
  parameters: {},
  errors: {
    unexpected_error: { status_code: 500, reason: 'unexpected_error' },
  },
  responses: {
    description: '',
    content: 'application/json',
    schema: {
      type: 'object',
      properties: {
        result: { type: 'String', desc: '처리 결과' },
      },
    },
  },
};

exports.apiSpec = apiSpec;
async function handler(inputObject, event) {
  console.log(event);
  // DynamoDB에서 ConnectionID 삭제
  const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-2" });
  const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
  try {
    await ddbUtil.doDelete(docClient, "chat-userlist", { "connection_id": event.requestContext.connectionId });
  } catch (e) {
    console.error(e);
    return { predefinedError: apiSpec.errors.unexpected_error };
  }

  return {
    status: 200,
    response: {
      result: 'success',
    },
  };
}

exports.handler = async (event, context) => {
  return handleHttpRequest(event, context, apiSpec, handler);
};
