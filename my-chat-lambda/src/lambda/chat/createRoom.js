const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

var ddbUtil = require("../lib/ddbUtilv3");

const apiSpec = {
    category: 'chat',
    event: [
        {
            type: 'REST',
            method: 'POST',
        },
    ],
    desc: '새로운 채팅방을 생성한다.',
    responses: {
        success: { statusCode: 200, body: 'Chat room created successfully' },
        failure: { statusCode: 500, body: 'Failed to create chat room' }
    }
};

exports.apiSpec = apiSpec;

async function handler(event) {
    const { room_id, user_name } = JSON.parse(event.body);
    const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-2" });
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

    const chatRoom = {
        room_id,
        master_user: user_name,
        created_at: new Date().toISOString()
    };

    try {
        await ddbUtil.put(docClient, "chat-room-list", chatRoom);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Chat room created successfully' })
        };
    } catch (error) {
        console.error('Error creating chat room:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to create chat room' })
        };
    }
}

exports.handler = handler;