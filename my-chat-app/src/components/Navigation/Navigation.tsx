import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <button className="navigation-button" onClick={() => navigate('/auth')}>관리자 페이지</button>
      <button className="navigation-button" onClick={() => navigate('/student')}>학생용 페이지</button>
    </div>
  );
}

export default Navigation;