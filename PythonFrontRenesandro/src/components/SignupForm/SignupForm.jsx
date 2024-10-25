import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './signupForm.module.css';
import { NavLink } from 'react-router-dom';
import { registerUser } from '../../store/slices/authSlice';
import { useForm } from 'react-hook-form';

export const SignupForm = () => {
  const { handleSubmit, control, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      terms: false,
    },
  });
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);

  const authError = useSelector((state) => state.auth.error);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleSurnameChange = (value) => {
    setSurname(value);
  };

  const handlePasswordConfirmChange = (value) => {
    setPasswordConfirm(value);
  };

  const onSubmit = () => {
    if (password !== passwordConfirm) {
      setPasswordMatch(true);
      return;
    }
    const data = {
      user: {
        email,
        name,
        surname,
        password,
      },
    };
    dispatch(registerUser(data));
  };

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.headerName}>Create an account</h1>
      <p className={styles.headerText}>Let's get started</p>
      <div className={styles.fullName}>
        <Input
          name="name"
          type="text"
          control={control}
          placeholder="Name"
          onValueChange={handleNameChange}
        />
        <Input
          name="surname"
          type="text"
          control={control}
          placeholder="Surname"
          onValueChange={handleSurnameChange}
        />
      </div>
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
      <Input
        name="passwordConfirm"
        type="password"
        control={control}
        placeholder="Confirm Password"
        onValueChange={handlePasswordConfirmChange}
      />
      <Button type="submit" size="lg">
        Sign Up
      </Button>
      <div className={styles.formFooter}>
        <p>
          Already have an account?
          <NavLink to="/login" key="Login">
            <span className={styles.loginPageBtn}>Sign in</span>
          </NavLink>
        </p>
      </div>
    </form>
  );
};
