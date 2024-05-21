
const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { ApiGatewayManagementApiClient, PostToConnectionCommand, GoneException } = require("@aws-sdk/client-apigatewaymanagementapi");

var ddbUtil = require("../lib/ddbUtilv3");
const { handleHttpRequest } = require('slsberry');
const apiSpec = {
    category: 'chat',
    event: [
        {
            type: 'dynamodb_stream',
            arn: { "Fn::GetAtt": ["chatappChatMessages", "StreamArn"] }
        },
    ],
    memory: 2048,
    timeout: 100,
    desc: '채팅메세지 입력 시 처리 : DynamoDB Stream에 의해 트리거',
    parameters: {},
    errors: {
        unexpected_error: { status_code: 500, reason: 'unexpected_error' },
    }
}
exports.apiSpec = apiSpec;
async function handler(inputObject, event) {
    console.log(JSON.stringify(event));

    const _event = event.Records[0];
    //만약 신규 채팅이 아니면 무시한다.
    if (_event.eventName !== "INSERT") {
        return {
            status: 200,
            response: "OK"
        };
    }
    const room_id = _event.dynamodb.NewImage.room_id.S;
    const timestamp = _event.dynamodb.NewImage.timestamp.N;
    const message = _event.dynamodb.NewImage.message.S;
    const user_id = _event.dynamodb.NewImage.user_id.S;
    const name = _event.dynamodb.NewImage.name.S;
    const item = {
        room_id: room_id,
        timestamp: timestamp,
        message: message,
        user_id: user_id,
        name: name

    }
    const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-2" });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    let data;
    try {
        data = await ddbUtil.query(docClient, "chat-userlist", ["room_id"], [room_id], { IndexName: 'room_id-user_id-index' });
    } catch (e) {
        console.error(e);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }
    console.log(JSON.stringify(data));

    const apigwManagementApi = new ApiGatewayManagementApiClient({
        apiVersion: '2018-11-29',
        region: 'ap-northeast-2',
        endpoint: `https://${process.env.socket_api_gateway_id}.execute-api.ap-northeast-2.amazonaws.com/${process.env.stage}-${process.env.version}`,
    });

    const postCommands = data.Items.map(({ connection_id }) => {
        const postData = { ConnectionId: connection_id, Data: JSON.stringify(item) };
        return apigwManagementApi.send(new PostToConnectionCommand(postData))
            .catch(e => {
                console.log(e);
                if (e instanceof GoneException) {
                    console.log(`Found stale connection, deleting ${connection_id}`);
                    return ddbUtil.doDelete(docClient, "chat-userlist", { "connection_id": connection_id });
                } else {
                    console.error("Error sending message:", e);
                }
            });
    });

    try {
        await Promise.all(postCommands);
    } catch (e) {
        console.error(e);
        return { predefinedError: apiSpec.errors.unexpected_error };
    }

    return {
        status: 200,
        response: data.Items
    };
}

exports.handler = async (event, context) => {
    return await handleHttpRequest(event, context, apiSpec, handler);
};
