import React from 'react';
import { ChatRoom } from '../../interfaces/ChatRoom'; // 채팅방 인터페이스 임포트 위치 확인 필요
import './ChatRoomList.css'; // 스타일 파일 임포트 위치 확인 필요
import { useNavigate } from 'react-router-dom'; // 라우터 사용을 위한 훅 추가

interface ChatRoomListProps {
    chatRooms: ChatRoom[];
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ chatRooms }) => {
    const navigate = useNavigate(); // 네비게이션 함수 사용

    const handleRoomClick = (roomId: string) => {
        navigate(`/chat-room/${roomId}`); // 클릭 시 해당 채팅방으로 이동
    };

    return (
        <ul className="chat-room-list">
            {chatRooms.map(room => (
                <li key={room.room_id} className="chat-room-item" onClick={() => handleRoomClick(room.room_id)}>
                    <div className="chat-room-info">
                        <h3 className="chat-room-name">{room.room_id}</h3>
                        <div className="chat-room-details">
                            <p className="chat-room-master">방장: {room.master_user}</p>
                            <p className="chat-room-date">생성일: {room.created_at}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ChatRoomList;