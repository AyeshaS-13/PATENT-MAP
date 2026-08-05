import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, Stack, CircularProgress, Chip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPatentPDF } from '../store/patentSlice';
import { useNavigate } from 'react-router-dom';

export default function UploadPDFScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.patent);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Send PDF as multipart FormData to backend for real PDF byte stream parsing
    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await dispatch(uploadPatentPDF(formData));
    if (uploadPatentPDF.fulfilled.match(res)) {
      navigate('/upload/progress');
    }
  };

  return (
    <Box sx={{ maxWidth: 650, mx: 'auto', mt: 4, p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Upload Patent PDF Document
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload USPTO / EPO patent specifications (PDF or TXT, max 15MB)
      </Typography>

      <Card>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box
            sx={{
              border: '2px dashed',
              borderColor: selectedFile ? 'primary.main' : 'divider',
              borderRadius: 4,
              p: 5,
              bgcolor: 'background.default',
              cursor: 'pointer',
              mb: 3
            }}
            onClick={() => document.getElementById('pdf-file-input').click()}
          >
            <input
              id="pdf-file-input"
              type="file"
              accept=".pdf,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <PictureAsPdfIcon color="primary" sx={{ fontSize: 56, mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedFile ? selectedFile.name : 'Click or Drag & Drop PDF Document Here'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports standard Patent Specifications (.pdf, .txt up to 15MB)
            </Typography>

            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Chip label={`${(selectedFile.size / 1024).toFixed(1)} KB`} color="primary" variant="outlined" />
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<CloudUploadIcon />}
            disabled={!selectedFile || loading}
            onClick={handleUpload}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Process PDF Document'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
