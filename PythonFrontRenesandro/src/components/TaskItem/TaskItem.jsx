import React, { useState } from 'react';
import { MdEditNote, MdOutlineDeleteOutline } from 'react-icons/md';
import styles from './taskItem.module.css';
import { AddEditTask } from '../AddEditTask/AddEditTask';

export const TaskItem = ({ task, onClick, isChecked, onCheckboxChange }) => {

  return (
    <div className={styles.taskItem} onClick={onClick}>
      <div className={styles.taskId}>{task.pk}</div>
      <div className={styles.taskName}>{task.title}</div>
      <div className={styles.taskLink}>{task.audio_url}</div>
      <div className={styles.promptsList}>{task.prompts}</div>
      <div className={styles.options}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
