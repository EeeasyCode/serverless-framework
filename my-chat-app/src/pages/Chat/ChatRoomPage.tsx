import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChatRoomPage.css'; // CSS 파일 임포트

interface ChatRoom {
    id: string;
    name: string;
}

const ChatRoomPage: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
        { id: '1', name: '채팅방 1' },
        { id: '2', name: '채팅방 2' }
    ]);

    return (
        <div className="chat-room-container">
            <div className="chat-room-content">
                <h1>채팅방 목록</h1>
                <ul className="chat-room-list">
                    {chatRooms.map(room => (
                        <li key={room.id} className="chat-room-item">
                            <Link to={`/chat/${room.id}`} className="chat-room-link">{room.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatRoomPage;