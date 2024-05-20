
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

    console.log(event);
    console.log("Received event:", JSON.stringify(event));
    try {
        // Extract the domain name and stage from the event
        const domainName = event.requestContext.domainName;
        const stage = event.requestContext.stage;

        // Create a new API Gateway Management API client
        const apiGwClient = new ApiGatewayManagementApiClient({
            endpoint: `https://${domainName}/${stage}`
        });

        // Extract the connection ID and the incoming message
        const connectionId = event.requestContext.connectionId;
        const body = JSON.parse(event.body);
        const message = body.message;

        // Prepare and send the response back to the client

        await apiGwClient.send(new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: JSON.stringify({
                data: "pong"
            })
        }));
        // console.log("Message sent");
        return { statusCode: 200, body: 'Message sent' };
    } catch (error) {
        console.error("Failed to send message", error);
        return { statusCode: 500, body: 'Failed to send message' };
    }






};
exports.handler = async (event, context) => {
    return await handleHttpRequest(event, context, apiSpec, handler);
};
