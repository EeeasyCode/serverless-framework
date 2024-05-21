
const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("@aws-sdk/client-apigatewaymanagementapi");
var ddbUtil = require("../lib/ddbUtilv3");
var moment = require('moment');
const { handleHttpRequest } = require('slsberry');
const apiSpec = {
    category: 'chat',
    event: [
        {
            type: 'websocket',
            method: 'websocket',
            route: '$default',
        },
    ],
    desc: '웹소켓 연결 기본 응답',
    parameters: {

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
    console.log("Received event:", JSON.stringify(event));
    try {
        const { domainName, stage, connectionId } = event.requestContext;
        const apiGwClient = new ApiGatewayManagementApiClient({
            endpoint: `https://${domainName}/${stage}`
        });

        const { message } = JSON.parse(event.body);

        const responsePayload = JSON.stringify({ data: "pong" });
        await apiGwClient.send(new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: responsePayload
        }));

        return { statusCode: 200, body: 'Message sent' };
    } catch (error) {
        console.error("Failed to send message", error);
        return { statusCode: 500, body: 'Failed to send message' };
    }
};

exports.handler = async (event, context) => {
    return await handleHttpRequest(event, context, apiSpec, handler);
};
