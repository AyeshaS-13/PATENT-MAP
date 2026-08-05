import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = '/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('patent_map_token')}` }
});

export const processPatentText = createAsyncThunk('patent/processText', async (textData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE}/patent/process-text`, textData, getAuthHeader());
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Patent processing failed.');
  }
});

export const uploadPatentPDF = createAsyncThunk('patent/uploadPDF', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE}/patent/upload`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('patent_map_token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'PDF upload failed.');
  }
});

export const fetchPatentList = createAsyncThunk('patent/fetchList', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE}/patent/list`, getAuthHeader());
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch patents.');
  }
});

export const fetchPatentDetails = createAsyncThunk('patent/fetchDetails', async (patentId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE}/patent/detail/${patentId}`, getAuthHeader());
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch patent details.');
  }
});

const patentSlice = createSlice({
  name: 'patent',
  initialState: {
    currentPatent: null,
    patentList: [],
    loading: false,
    uploadProgress: 0,
    error: null,
    activeStep: 0
  },
  reducers: {
    setCurrentPatent: (state, action) => {
      state.currentPatent = action.payload;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    clearPatentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processPatentText.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(processPatentText.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatent = action.payload;
      })
      .addCase(processPatentText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadPatentPDF.pending, (state) => { state.loading = true; state.uploadProgress = 50; state.error = null; })
      .addCase(uploadPatentPDF.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        state.currentPatent = action.payload;
      })
      .addCase(uploadPatentPDF.rejected, (state, action) => {
        state.loading = false;
        state.uploadProgress = 0;
        state.error = action.payload;
      })
      .addCase(fetchPatentList.fulfilled, (state, action) => {
        state.patentList = action.payload;
      })
      .addCase(fetchPatentDetails.fulfilled, (state, action) => {
        state.currentPatent = action.payload;
      });
  }
});

export const { setCurrentPatent, setActiveStep, clearPatentError } = patentSlice.actions;
export default patentSlice.reducer;
