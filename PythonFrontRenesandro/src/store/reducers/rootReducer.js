import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice.js';
import audioReducer from '../slices/audioSlice.js';
import userReducer from '../slices/userSlice.js';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  audio: audioReducer,
});

export default rootReducer;
