import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Divider, Paper } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ContentExtractionViewScreen() {
  const navigate = useNavigate();
  const { currentPatent } = useSelector((state) => state.patent);

  const title = currentPatent?.extraction?.title || currentPatent?.patent?.title || 'System and Method for Deep Learning Feature Classification in Multi-Modal Sensor Networks';
  const abstract = currentPatent?.extraction?.abstract || currentPatent?.patent?.abstract || 'Methods and systems for training multi-layer neural network classifiers using dynamic feature extraction from multi-modal sensor arrays.';
  const claims = currentPatent?.extraction?.claims || currentPatent?.patent?.claims || '1. A computer-implemented method comprising receiving sensor data streams, generating feature vectors using a convolutional neural network layer, and computing loss functions based on multi-task attention mechanisms.';
  const description = currentPatent?.extraction?.description || currentPatent?.patent?.description || 'The present invention relates generally to artificial intelligence and deep neural network architecture optimization...';

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Extracted Patent Sections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            NLP parsing results for Title, Abstract, Claims, and Description
          </Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/processing/domain')}>
          Next: Domain Detection
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                PATENT TITLE
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                {title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              ABSTRACT SECTION
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {abstract}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              CLAIMS SECTION
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontFamily: 'monospace' }}>
              {claims}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              DETAILED DESCRIPTION PREVIEW
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {description}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
