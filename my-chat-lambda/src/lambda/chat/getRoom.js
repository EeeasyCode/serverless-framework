
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
var ddbUtil = require("../lib/ddbUtilv3");
const { handleHttpRequest } = require('slsberry');

const apiSpec = {
    category: 'chat',
    event: [
        {
            type: 'REST',
            method: 'Get',
        },
    ],
    desc: '채팅방 목록을 가져온다.',
    errors: {
        unexpected_error: { status_code: 500, reason: 'unexpected_error' },
    },
    responses: {
        description: '',
        content: 'application/json',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    room_id: { type: 'String', desc: '채팅방 아이디' },
                    master_user: { type: 'String', desc: '채팅방 이름' },
                    created_at: { type: 'Date', desc: '채팅방 생성일시' }
                },
            },
        },
    },
}

exports.apiSpec = apiSpec;

async function handler(inputObject, event) {
    try {
    const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-2" });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const data = await ddbUtil.scan(docClient, "chat-room-list");

    return {
        status: 200,
        response: data.Items
    };
    } catch (e) {
        console.error('에러:', e);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }
}

exports.handler = async (event, context) => {
    return await handleHttpRequest(event, context, apiSpec, handler);
};
