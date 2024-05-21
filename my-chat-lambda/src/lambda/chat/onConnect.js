
const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
var ddbUtil = require("../lib/ddbUtilv3");
var moment = require('moment');
const { handleHttpRequest } = require('slsberry');
const apiSpec = {
    category: 'chat',
    event: [
        {
            type: 'websocket',
            method: 'websocket',
            route: '$connect',
        },
    ],
    desc: '웹소켓 연결 처리.',
    parameters: {
        "room_id": { "req": true, "type": "String", "desc": "현재 채팅이 이루어진 방의 아이디" }
    },
    errors: {
        unexpected_error: { status_code: 500, reason: 'unexpected_error' },
    },
    responses: {
        description: '',
        content: 'application/json',
        schema: {
            type: 'object',
            properties: {
            },
        },
    },
}


exports.apiSpec = apiSpec;
async function handler(inputObject, event) {
    console.log(event);
    const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-2" });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const { room_id, user_id } = inputObject;
    const timestamp = moment().valueOf();
    const connection_id = event.requestContext.connectionId;

    const userItem = {
        room_id,
        connection_id,
        user_id,
        timestamp
    };

    const welcomeMessageItem = {
        room_id,
        timestamp,
        message: `${user_id}님이 입장하셨습니다.`,
        user_id: 'system',
        name: 'system'
    };

    try {
        await Promise.all([
            ddbUtil.put(docClient, "chat-userlist", userItem),
            ddbUtil.put(docClient, "chat-messages", welcomeMessageItem)
        ]);
    } catch (e) {
        console.error(e);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }

    return {
        status: 200,
        response: {}
    };
};

exports.handler = async (event, context) => {
    return await handleHttpRequest(event, context, apiSpec, handler);
};
