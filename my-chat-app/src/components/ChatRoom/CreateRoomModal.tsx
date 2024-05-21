import React from 'react';
import './CreateRoomModal.css';

interface CreateRoomModalProps {
    showModal: boolean;
    roomName: string;
    setShowModal: (show: boolean) => void;
    setRoomName: (name: string) => void;
    createRoom: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
    showModal,
    roomName,
    setShowModal,
    setRoomName,
    createRoom
}) => {
    if (!showModal) return null;

    return (
        <div className="modal">
            <div className="modal-content">
            <span onClick={() => setShowModal(false)} className="close-button">&#x2190;</span> {/* 뒤로가기 이모티콘 사용 */}
                <h2>새 채팅방 생성</h2>
                <input
                    className="create-room-input"
                    type="text"
                    placeholder="채팅방 이름 입력"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button className="create-room-submit" onClick={createRoom}>생성</button>
            </div>
        </div>
    );
};

export default CreateRoomModal;