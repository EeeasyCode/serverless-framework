
const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { handleHttpRequest } = require('slsberry');

var moment = require('moment');
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
    console.log("Event received:", event);
    const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-2" });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const now = moment().valueOf();
    const chatItem = {
        room_id: inputObject.room_id,
        timestamp: now,
        message: inputObject.text,
        user_id: inputObject.user_id,
        name: inputObject.name,
    };

    try {
        await ddbUtil.put(docClient, "chat-messages", chatItem);
    } catch (error) {
        console.error("Error inserting chat message:", error);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }

    return {
        status: 200,
        response: { result: "ok" }
    };
};

exports.handler = async (event, context) => {
    return handleHttpRequest(event, context, apiSpec, handler);
};