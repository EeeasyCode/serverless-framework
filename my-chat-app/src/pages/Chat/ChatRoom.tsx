import React, { Component } from 'react';
import axios from 'axios';
import { Map } from "immutable";

class ChatRoom extends Component {
  websocket: WebSocket | null = null;
  
  componentDidMount = async () => {
    
    const result = await axios({
      method: "GET",
      url: `https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chat`,
      params: {
        room_id: "test",
      },
    });
    
    this.connectToWebSocket();
  }
  
  connectToWebSocket = () => {
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      const userId = localStorage.getItem('userEmail')?.split('@')[0];
      const roomId = '안녕?';
      const websocketUrl = `wss://0fxynlv5yg.execute-api.ap-northeast-2.amazonaws.com/dev-1?user_id=${userId}&room_id=${roomId}`;
      
      this.websocket = new WebSocket(websocketUrl);
  
      this.websocket.onopen = () => {
        console.log('WebSocket 연결 성공');
      };
  
      this.websocket.onmessage = (event) => {
        console.log('메시지 수신:', event.data);
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

  
  render() {
    
    return (
      <div>
        <h1>채팅방</h1>
        <div>
        
      </div>
      </div>
    );
  }
}

export default ChatRoom;