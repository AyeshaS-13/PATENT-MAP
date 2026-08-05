import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Alert, CircularProgress, Stack } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { useDispatch, useSelector } from 'react-redux';
import { processPatentText } from '../store/patentSlice';
import { useNavigate } from 'react-router-dom';

export default function PasteAbstractClaimsScreen() {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [claims, setClaims] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.patent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedText = `TITLE: ${title}\n\nABSTRACT:\n${abstract}\n\nCLAIMS:\n${claims}\n\nDESCRIPTION:\n${description}`;
    const res = await dispatch(processPatentText({ text: combinedText }));
    if (processPatentText.fulfilled.match(res)) {
      navigate('/processing/extraction');
    }
  };

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Paste Patent Abstract & Claims
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manually structure your patent specification sections for precise NLP extraction & classification
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Patent Title"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. System and Method for Deep Learning Feature Classification"
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Abstract"
                    multiline
                    rows={6}
                    fullWidth
                    required
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder="Enter patent abstract..."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Claims (Independent & Dependent)"
                    multiline
                    rows={6}
                    fullWidth
                    required
                    value={claims}
                    onChange={(e) => setClaims(e.target.value)}
                    placeholder="1. A computer-implemented method comprising..."
                  />
                </Grid>
              </Grid>

              <TextField
                label="Detailed Description (Optional)"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Field of invention, embodiment details..."
              />

              <Button type="submit" variant="contained" size="large" startIcon={<ArticleIcon />} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Process Form & Classify CPC'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
