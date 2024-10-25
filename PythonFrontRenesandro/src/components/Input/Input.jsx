import React, { useState } from 'react';
import styles from './input.module.css';
import { Controller } from 'react-hook-form';

export const Input = ({
  type = 'text',
  name,
  control,
  placeholder,
  defaultValue = '',
  onValueChange,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={styles.inputWrapper}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required: true }}
        render={({ field }) => (
          <input
            {...field}
            {...rest}
            type={type}
            placeholder={placeholder}
            value={inputValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              field.onChange(e);
              setInputValue(e.target.value);
              if (onValueChange) {
                onValueChange(e.target.value);
              }
            }}
            className={styles.inputController}
            style={{
              color: type === 'password' ? '#cbcbcb' : '#647080',
            }}
          />
        )}
      />
    </div>
  );
};
