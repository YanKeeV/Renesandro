import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import styles from './main.module.css';
import { Button } from '../../components/Button/Button';
import { TaskItem } from '../../components/TaskItem/TaskItem';
import { AddEditTask } from '../../components/AddEditTask/AddEditTask';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAudioAction, batchRemoveAudioAction } from '../../store/slices/audioSlice';

export const Main = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [checkedItems, setCheckedItems] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();
  const audios = useSelector((state) => state.audio.audios);
  const status = useSelector((state) => state.audio.status);
  const error = useSelector((state) => state.audio.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAudioAction());
    }
  }, [dispatch, status]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('audio_file', selectedFile);

      fetch('http://localhost:8000/audio/upload/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('File uploaded successfully:', data);
          dispatch(fetchAudioAction());
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.log('No file selected');
    }
  };

  const handleDeleteTask = async () => {
    const selectedIds = Object.keys(checkedItems)
    .filter((key) => checkedItems[key]);

    if (selectedIds.length === 0) {
      console.log('No items selected for deletion');
      return;
    }

    await dispatch(batchRemoveAudioAction({ ids: selectedIds }));
    await dispatch(fetchAudioAction());
  };

  const handleModalOpen = (audio = null) => {
    setSelectedTask(audio);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (pk) => {
    setCheckedItems((prev) => ({
      ...prev,
      [pk]: !prev[pk],
    }));
  };

  return (
    <div className={styles.mainWrapper}>
      <Header />
      <main>
        <div className={styles.main}>
          <div className={styles.heroImage}></div>
          <div className={styles.audioInputWrapper}>
            <p>Enter audio link to analyze</p>
            <div>
              <input type="file" placeholder="Enter audio link..." onChange={handleFileChange}/>
              <div>
                <Button size="lg" onClick={handleUpload}>Analyze</Button>
                <Button size="lg" onClick={() => handleModalOpen()}>
                  Create Task
                </Button>
                <Button size="lg" onClick={() => handleDeleteTask()}>
                  Delete selected
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.tasksTable}>
            <div className={styles.tableHeader}>
              <p className={styles.headerId}>ID</p>
              <p className={styles.headerName}>Audio name</p>
              <p className={styles.headerLink}>Audio link</p>
              <p className={styles.headerPrompts}>Prompts</p>
              <p className={styles.headerOptions}>Options</p>
            </div>
            <div className={styles.taskList}>
              {audios.map((audio) => (
                <TaskItem
                  key={audio.pk}
                  task={audio}
                  onCheckboxChange={() => handleCheckboxChange(audio.pk)}
                  isChecked={!!checkedItems[audio.pk]}
                  onClick={() => handleModalOpen(audio)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <AddEditTask
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={selectedTask}
        type={selectedTask ? 'edit' : 'add'}
      />
    </div>
  );
};
