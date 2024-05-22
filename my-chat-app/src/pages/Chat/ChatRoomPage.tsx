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
        fetch('https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chatRoom')
            .then(response => response.json())
            .then(data => setChatRooms(data))
            .catch(error => console.error('Error fetching chat rooms:', error));
    };

    // 컴포넌트 마운트 시 채팅방 목록 불러오기
    useEffect(() => {
        fetchChatRooms();
    }, []);

    // 채팅방 생성 함수
    const createRoom = () => {
        const url = 'https://sn2vhvatza.execute-api.ap-northeast-2.amazonaws.com/dev/chat/createRoom';
        const data = {
            room_id: roomName,
            user_name: localStorage.getItem('userEmail')?.split("@")[0]
        };
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