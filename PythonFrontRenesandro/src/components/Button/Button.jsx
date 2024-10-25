import React from 'react';
import styles from './button.module.css';

export const Button = ({ children, onClick, type = 'button', size = 'md' }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[size]}`}
      type={type}
    >
      {children}
    </button>
  );
};
