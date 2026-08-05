import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, TextField, Stack, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
import { processPatentText, clearPatentError } from '../store/patentSlice';
import { useNavigate } from 'react-router-dom';

export default function QuickUploadScreen() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.patent);

  const handleQuickSubmit = async () => {
    if (!text.trim()) return;
    dispatch(clearPatentError());
    const res = await dispatch(processPatentText({ text }));
    if (processPatentText.fulfilled.match(res)) {
      navigate('/processing/extraction');
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 3, p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Quick Patent Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Paste raw patent abstract or claims text to trigger instant AI parsing & CPC classification
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Stack spacing={3}>
            <TextField
              label="Patent Abstract, Claims, or Full Text"
              multiline
              rows={8}
              fullWidth
              placeholder="Paste patent title, abstract, or claims (e.g. TITLE: System and Method for Deep Learning Feature Classification...)"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button
              variant="contained"
              size="large"
              startIcon={<CloudUploadIcon />}
              disabled={loading || !text.trim()}
              onClick={handleQuickSubmit}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Instant AI CPC Analysis'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
