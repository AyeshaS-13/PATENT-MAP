import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import patentReducer from './patentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patent: patentReducer
  }
});
