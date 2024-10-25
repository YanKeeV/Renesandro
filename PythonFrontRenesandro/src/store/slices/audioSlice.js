import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAudio, createAudio, deleteAudio, updateAudio, uploadAudio, batchDeleteAudio } from '../api/audioApi.js';

export const selectToken = (state) => state.auth.accessToken;

export const fetchAudioAction = createAsyncThunk(
  'audio/fetchAudio',
  async (loginToken, { rejectWithValue, getState }) => {
    try {
      const token = loginToken || selectToken(getState());
      const data = await getAudio(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const uploadAudioAction = createAsyncThunk(
  'audio/uploadAudio',
  async ({ loginToken, audio_file }, { rejectWithValue, getState }) => {
    try {
      const token = loginToken || selectToken(getState());
      const data = await uploadAudio(token, audio_file);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addAudio = createAsyncThunk(
  'audio/addAudio',
  async ({ loginToken, audioData }, { rejectWithValue }) => {
    try {
      const token = loginToken || selectToken(getState());
      const data = await createAudio(token, audioData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const removeAudioAction = createAsyncThunk(
  'audio/removeAudio',
  async ({ loginToken, audioId }, { rejectWithValue, getState }) => {
    try {
      const token = loginToken || selectToken(getState());
      await deleteAudio(token, audioId);
      return audioId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const batchRemoveAudioAction = createAsyncThunk(
  'audio/batchRemoveAudio',
  async ({ loginToken, ids }, { rejectWithValue, getState }) => {
    console.log(ids)
    
    try {
      const token = loginToken || selectToken(getState());
      console.log(token)
      await batchDeleteAudio(token, ids);
      return ids;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const editAudioAction = createAsyncThunk(
  'audio/editAudio',
  async ({ loginToken, audioData, audioId }, { rejectWithValue, getState }) => {
    try {
      const token = loginToken || selectToken(getState());
      const data = await updateAudio(token, audioData, audioId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    audios: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudioAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAudioAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.audios = action.payload;
      })
      .addCase(fetchAudioAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addAudio.fulfilled, (state, action) => {
        state.audios.push(action.payload);
      })
      .addCase(addAudio.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeAudioAction.fulfilled, (state, action) => {
        state.audios = state.audios.filter((audio) => audio.id !== action.payload);
      })
      .addCase(removeAudioAction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editAudioAction.fulfilled, (state, action) => {
        const index = state.audios.findIndex(
          (audio) => audio.id === action.payload.id,
        );
        if (index !== -1) {
          state.audios[index] = action.payload;
        }
      })
      .addCase(editAudioAction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(uploadAudioAction.pending, (state) => {
        state.status = 'uploading';
      })
      .addCase(uploadAudioAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.audios.push(action.payload);
      })
      .addCase(uploadAudioAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(batchRemoveAudioAction.pending, (state) => {
        state.status = 'deleting';
      })
      .addCase(batchRemoveAudioAction.fulfilled, (state, action) => {
        state.audios = state.audios.filter((audio) => !action.payload.includes(audio.id));
        state.status = 'succeeded';
      })
      .addCase(batchRemoveAudioAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default audioSlice.reducer;
