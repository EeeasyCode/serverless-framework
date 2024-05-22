import React, { Component } from 'react';
import axios from 'axios';

class ChatRoom extends Component {
  state = {
    messages: [],
    roomId: null,
    userId: null,
    inputMessage: ''
  };

  websocket: WebSocket | null = null;

  async componentDidMount() {
    const userId = localStorage.getItem('userEmail')?.split('@')[0];
    const roomId = '안녕?'; // 예시로 'test'를 사용합니다. 실제로는 동적으로 설정할 수 있습니다.

    this.setState({ userId, roomId });

    const result = await axios({
      method: "GET",
      url: `https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chat`,
      params: { room_id: roomId },
    });

    this.connectToWebSocket();
  }

  connectToWebSocket = () => {
    const { userId, roomId } = this.state;
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      const websocketUrl = `wss://0fxynlv5yg.execute-api.ap-northeast-2.amazonaws.com/dev-1?user_id=${userId}&room_id=${roomId}`;
      
      this.websocket = new WebSocket(websocketUrl);
  
      this.websocket.onopen = () => {
        console.log('WebSocket 연결 성공');
      };
  
      this.websocket.onmessage = (event) => {
        console.log('메시지 수신:', event.data);
        this.setState((prevState: { messages: string[] }) => ({
          messages: [...prevState.messages, event.data]
        }));
      };
  
      this.websocket.onerror = (error) => {
        console.error('WebSocket 오류:', error);
      };
  
      this.websocket.onclose = () => {
        console.log('WebSocket 연결 종료');
      };
    } else {
      console.log('WebSocket 이미 연결됨');
    }
  }

  componentWillUnmount() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputMessage: event.target.value });
  }

  handleSendMessage = async () => {
    const { inputMessage, roomId, userId } = this.state;
    if (inputMessage.trim()) {
      try {
        const response = await axios({
          method: 'PUT',
          url: 'https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chat',
          data: {
            room_id: roomId,
            text: inputMessage,
            user_id: userId,
            name: userId // 사용자 이름도 같이 전송, 필요에 따라 수정 가능
          }
        });
        console.log('메시지 전송 성공:', response.data);
        this.setState({ inputMessage: '' }); // 메시지 전송 후 입력 필드 초기화
      } catch (error) {
        console.error('메시지 전송 실패:', error);
      }
    }
  }

  render() {
    const { messages, inputMessage } = this.state;
    return (
      <div>
        <h1>채팅방</h1>
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <input
          type="text"
          value={inputMessage}
          onChange={this.handleMessageChange}
          placeholder="메시지 입력..."
        />
        <button onClick={this.handleSendMessage}>보내기</button>
      </div>
    );
  }
}

export default ChatRoom;