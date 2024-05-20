endpoints:
  wss://0fxynlv5yg.execute-api.ap-northeast-2.amazonaws.com/dev-1
  GET - https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chat
  PUT - https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chat
functions:
  chat_get: my-chat-lambda_dev_1_chat_get (3.1 MB)
  chat_handleStream: my-chat-lambda_dev_1_chat_handleStream (3.1 MB)
  chat_onConnect: my-chat-lambda_dev_1_chat_onConnect (3.1 MB)
  chat_onDefault: my-chat-lambda_dev_1_chat_onDefault (3.1 MB)
  chat_onDisconnect: my-chat-lambda_dev_1_chat_onDisconnect (3.1 MB)
  chat_put: my-chat-lambda_dev_1_chat_put (3.1 MB)