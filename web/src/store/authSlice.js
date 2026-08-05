import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = '/api';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    localStorage.setItem('patent_map_token', res.data.data.token);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Login failed.');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/register`, userData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Registration failed.');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otpData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/verify-otp`, otpData);
    localStorage.setItem('patent_map_token', res.data.data.token);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'OTP verification failed.');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('patent_map_token');
    if (!token) return null;
    const res = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
  } catch (err) {
    localStorage.removeItem('patent_map_token');
    return rejectWithValue('Session expired.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('patent_map_token') || null,
    loading: false,
    error: null,
    otpPendingEmail: null,
    sampleOtp: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('patent_map_token');
      state.user = null;
      state.token = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setPendingOtpEmail: (state, action) => {
      state.otpPendingEmail = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.otpPendingEmail = action.payload.email;
        state.sampleOtp = action.payload.sampleOtp;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.otpPendingEmail = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout, clearAuthError, setPendingOtpEmail } = authSlice.actions;
export default authSlice.reducer;
