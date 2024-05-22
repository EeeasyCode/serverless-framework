import React, { useState, useEffect } from 'react';
import ChatRoomList from '../../components/ChatRoom/ChatRoomList';
import CreateRoomModal from '../../components/ChatRoom/CreateRoomModal';
import { ChatRoom } from '../../interfaces/ChatRoom';

import './ChatRoomPage.css';

const ChatRoomPage: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [roomName, setRoomName] = useState('');

    // 채팅방 목록을 불러오는 함수
    const fetchChatRooms = () => {
        const apiUrl = process.env.REACT_APP_CHAT_ROOM_URL;
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setChatRooms(data))
                .catch(error => console.error('Error fetching chat rooms:', error));
        } else {
            console.error('API URL is undefined');
        }
    };

    // 컴포넌트 마운트 시 채팅방 목록 불러오기
    useEffect(() => {
        fetchChatRooms();
    }, []);

    // 채팅방 생성 함수
    const createRoom = () => {
        const url = process.env.REACT_APP_CREATE_ROOM_URL;
        const data = {
            room_id: roomName,
            user_name: localStorage.getItem('userEmail')?.split("@")[0]
        };
        if (url) {
            fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {
            // 채팅방 생성 후 채팅방 목록 다시 불러오기
            fetchChatRooms();
            setShowModal(false);
            setRoomName('');
        })
        .catch(error => {
            console.error('Error creating room:', error);
            alert(`채팅방 생성에 실패했습니다: ${error.message}`);
        });
    } else {
        console.error('API URL is undefined');
    }
    };

    return (
        <div className="chat-room-container">
            <div className="chat-room-content">
                <h1>채팅방 목록</h1>
                <ChatRoomList chatRooms={chatRooms} />
                <button className="create-room-button" onClick={() => setShowModal(true)}>채팅방 생성</button>
            </div>
            <CreateRoomModal
                showModal={showModal}
                roomName={roomName}
                setShowModal={setShowModal}
                setRoomName={setRoomName}
                createRoom={createRoom}
            />
        </div>
    );
};

export default ChatRoomPage;