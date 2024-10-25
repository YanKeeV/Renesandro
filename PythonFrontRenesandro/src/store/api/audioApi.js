import axiosInstance from './axiosInstance';

export const getAudio = async (token) => {
  try {
    const response = await axiosInstance.get('/audio/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const uploadAudio = async (token, formData) => {
  try {
    console.log('FormData being sent:', formData);
    const response = await axiosInstance.post('/audio/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const createAudio = async (token, data) => {
  try {
    const response = await axiosInstance.post('/notes/create/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const deleteAudio = async (token, audioId) => {
  try {
    const response = await axiosInstance.delete(`/audio/delete/${audioId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const batchDeleteAudio = async (token, ids) => {
  try {
    const response = await axiosInstance.delete(`/audio/batch-delete/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const updateAudio = async (token, data, noteId) => {
  try {
    const response = await axiosInstance.put(`/audio/update/${noteId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};
