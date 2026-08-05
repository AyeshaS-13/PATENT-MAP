import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Stack, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useNavigate } from 'react-router-dom';

export default function UploadProgressScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/processing/extraction');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 1 }}>
      <Card>
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <PsychologyIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Processing Patent AI Pipeline
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Executing PDF section parsing, domain TF-IDF scoring, and CPC code ML recommendation...
          </Typography>

          <LinearProgress sx={{ height: 10, borderRadius: 5, mb: 3 }} />

          <Stack spacing={1} sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="caption" color="text.secondary">✓ PDF Byte Stream Received</Typography>
            <Typography variant="caption" color="text.secondary">✓ Title, Abstract & Claims Extracted</Typography>
            <Typography variant="caption" color="text.secondary">✓ TF-IDF & BM25 Classification Active</Typography>
          </Stack>

          <Button variant="contained" onClick={() => navigate('/processing/extraction')}>
            Proceed to Content Extraction
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
