import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { Button } from '../Button/Button';
import styles from './addEditTask.module.css';
import { removeAudioAction, fetchAudioAction, editAudioAction } from '../../store/slices/audioSlice';

export const AddEditTask = ({ isOpen, onClose, type, task }) => {
  const [title, setName] = useState('');
  const [link, setLink] = useState('');
  const [prompts, setPrompts] = useState('');
  const [audioId, setAudioId] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (task) {
      setName(task.title || '');
      setLink(task.audio_url || '');
      setPrompts(task.prompts || '');
      setAudioId(task.pk || '');
    } else {
      setName('');
      setLink('');
      setPrompts('');
      setAudioId('');
    }
  }, [task]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (type === 'edit') {
      if (title === '' || prompts === '') return;
      const audioData = {
        title,
        prompts: prompts.split(',').map(item => item.trim()),
      };
      await dispatch(editAudioAction({ audioId, audioData }));
      await dispatch(fetchAudioAction());
    } else {
      if (title === '' || prompts === '') return;
      if (selectedFile) {
        const formData = new FormData();

        formData.append('audio_file', selectedFile);

        formData.append('title', title);
        formData.append('prompts', JSON.stringify(prompts));
    
        fetch('http://localhost:8000/audio/create/', {
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
    }
    setName('');
    setLink('');
    setPrompts('');
    onClose();
  };

  const handleDelete = async () => {
    await dispatch(removeAudioAction({ audioId }));
    await dispatch(fetchAudioAction());
    setName('');
    setLink('');
    setPrompts('');
    onClose();
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <p
            className={styles.modalType}
          >{`${type === 'add' ? 'Add' : 'Edit'} task...`}</p>
          <div className={styles.noteTools}>
            {type === 'edit' ? (
              <>
                <MdOutlineDeleteOutline
                  className={styles.navBtn}
                  onClick={handleDelete}
                />
                <IoClose className={styles.navBtn} onClick={handleCloseModal} />
              </>
            ) : (
              <IoClose className={styles.navBtn} onClick={handleCloseModal} />
            )}
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.titleWrapper}>
            <label className={styles.label}>NAME</label>
            <input
              type="text"
              placeholder="Enter name..."
              className={styles.title}
              onChange={(e) => setName(e.target.value)}
              value={title}
            />
          </div>
          {type === 'edit' && (
            <div className={styles.linkWrapper}>
              <label className={styles.label}>LINK</label>
              <p className={styles.title}>{link}</p>
            </div>
          )}
          {type === 'add' && (
            <div className={styles.linkWrapper}>
              <label className={styles.label}>LINK</label>
              <input type="file" placeholder="Enter audio link..." onChange={handleFileChange}/>
            </div>
          )}
          <div className={styles.promptsWrapper}>
            <label className={styles.label}>PROMPTS</label>
            <textarea
              className={styles.prompts}
              placeholder="Enter prompts..."
              rows={5}
              onChange={(e) => setPrompts(e.target.value)}
              value={prompts}
            ></textarea>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};
