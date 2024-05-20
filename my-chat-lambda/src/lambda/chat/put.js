
const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
var moment = require('moment');
const { handleHttpRequest } = require('slsberry');
var ddbUtil = require("../lib/ddbUtilv3");
const apiSpec = {
    category: 'chat',
    event: [
        {
            type: 'REST',
            method: 'Put',
        },
    ],
    desc: '채팅을 입력한다.',
    parameters: {
        room_id: { "req": true, "type": "String", "desc": "채팅방 아이디" },
        text: { "req": true, "type": "String", "desc": "text" },
        user_id: { "req": true, "type": "String", "desc": "user_id" },
        name: { "req": true, "type": "String", "desc": "name" },
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
    //입력 받은 채팅 레코드를 만들어서
    const now = moment().valueOf();
    const item = {
        room_id: inputObject.room_id,
        timestamp: now,
        message: inputObject.text,
        user_id: inputObject.user_id,
        name: inputObject.name,
    };
    //dynammodb에 넣는다.
    try {
        await ddbUtil.put(docClient, "chat-messages", item);
    } catch (e) {
        console.error(e);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }
    //나머지는 stream이 처리해줄것이다.

    return {
        status: 200,
        response: {
            result: "ok",
        }
    };
};
exports.handler = async (event, context) => {
    return await handleHttpRequest(event, context, apiSpec, handler);
};