import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ChatRoomPage.css';

interface ChatRoom {
    room_id: string;
    timestamp: string;
}

const ChatRoomPage: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        fetch(' https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chatRoom') // 채팅방 목록 API URL
            .then(response => response.json())
            .then(data => setChatRooms(data))
            .catch(error => console.error('Error fetching chat rooms:', error));
    }, []);

    return (
        <div className="chat-room-container">
            <div className="chat-room-content">
                <h1>채팅방 목록</h1>
                {chatRooms.length > 0 ? (
                    <ul className="chat-room-list">
                        {chatRooms.map(room => (
                            <li key={room.room_id} className="chat-room-item">
                                <Link to={`/chat/${room.room_id}`} className="chat-room-link">{room.room_id}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>채팅방이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default ChatRoomPage;