import React, { useEffect } from 'react';
import styles from './header.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { getUserAction } from '../../store/slices/userSlice';

export const Header = () => {
  const dispatch = useDispatch();
  const name = useSelector(state => state.user.name);
  const surname = useSelector(state => state.user.surname);
  const email = useSelector((state) => state.user.email);
  const status = useSelector((state) => state.user.status);

  const { logout } = useAuth();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getUserAction());
    }
  }, [dispatch, status]);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <p className={styles.left}>Audio Analyzer</p>
        <p className={styles.right}>
        {name + ' ' + surname + ' ' + email + ', '}
        <button className={styles.logoutBtn} onClick={logout}>logout</button>
        </p>
      </div>
    </div>
  );
};
