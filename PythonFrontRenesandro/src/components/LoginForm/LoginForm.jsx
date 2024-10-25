import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './loginForm.module.css';

export const LoginForm = () => {
  const { handleSubmit, control, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      terms: false,
    },
  });

   const { login } = useAuth();

   const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector((state) => state.auth.error);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const onSubmit = () => {
    const credentials = {
      user: {
        email,
        password,
      },
    };
    login(credentials);
  };

  return (
    <form className={styles.signinForm} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.headerName}>Sign In</h1>
      <p className={styles.headerText}>
        Enter your email address and password to get access to account
      </p>
      <Input
        name="email"
        type="text"
        control={control}
        placeholder="Email"
        onValueChange={handleEmailChange}
      />
      <Input
        name="password"
        type="password"
        control={control}
        placeholder="Password"
        onValueChange={handlePasswordChange}
      />
      <Button type="submit" size="lg">
        Sign In
      </Button>
      <div className={styles.formFooter}>
        <p>
          Don't have an account?
          <NavLink to="/signup" key="Signup">
            <span className={styles.loginPageBtn}>Sign Un</span>
          </NavLink>
        </p>
      </div>
    </form>
  );
};
