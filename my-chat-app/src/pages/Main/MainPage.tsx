import React from 'react';
import './MainPage.css';
import LoginForm from '../../components/LoginForm/LoginForm';

const MainPage: React.FC = () => {
  return (
    <div className="main-container">
      <LoginForm />
    </div>
  );
}

export default MainPage;