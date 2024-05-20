import React from 'react';
import './RegisterPage.css';
import RegisterForm from '../../components/RegisterForm/RegisterForm';


const RegisterPage: React.FC = () => {
  return (
    <div className="register-container">
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;