const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
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
    desc: '채팅을 가져온다.',
    parameters: {
        room_id: { "req": true, "type": "String", "desc": "채팅방 아이디" },
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
                room_id: { type: 'String', desc: '채팅방 아이디' },
                timestamp: { type: 'Integer', desc: '타임스탬프' },
                message: { type: 'String', desc: '메세지' },
                name: { type: 'String', desc: '이름' },
                user_id: { type: 'String', desc: '유저아이디' },
            },
        },
    },
}

exports.apiSpec = apiSpec;

async function handler(inputObject, event) {
    console.log(event);
    const { room_id, lastEvaluatedKey } = inputObject;
    const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-2" });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

    let data = undefined;
    const params = {
        Limit: 10, // 한 번에 가져올 아이템의 수를 제한
        ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined
    };
    try {
        data = await ddbUtil.query(docClient, "chat-messages", ["room_id"], [room_id], params)
    } catch (e) {
        console.error(e);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }
    return {
        status: 200,
        response: data.Items,
        lastEvaluatedKey: JSON.stringify(data.LastEvaluatedKey) // 다음 페이지를 위한 키
    };
}