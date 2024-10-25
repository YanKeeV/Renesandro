import React, { useEffect, useState } from 'react';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { SignupForm } from '../../components/SignupForm/SignupForm';
import { useLocation } from 'react-router-dom';
import img from '../../assets/bg.jpg';
import styles from './auth.module.css';

export const Auth = () => {
  const location = useLocation();
  const [pageSelector, setPageSelector] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/login') {
      setPageSelector('login');
    } else if (path === '/signup') {
      setPageSelector('signup');
    }
  }, [location.pathname]);

  const renderForm = () => {
    switch (pageSelector) {
      case 'login':
        return <LoginForm />;
      case 'signup':
        return <SignupForm />;
      default:
        return <SignupForm />;
    }
  };

  return (
    <div
      // style={{
      //   height: '100svh',
      //   display: 'flex',
      //   justifyContent: 'center',
      //   alignItems: 'center',
      //   backgroundImage: `url(${img})`,
      // }}
      className={styles.authWrapper}
    >
      {renderForm()}
    </div>
  );
};
