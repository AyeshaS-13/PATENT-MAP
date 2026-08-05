import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CompareIcon from '@mui/icons-material/Compare';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useParams, useNavigate } from 'react-router-dom';

export default function PatentDetailViewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const patId = id || 'US11847520B2';

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Patent Detail: {patId}
            </Typography>
            <Chip label="G06N 3/02" color="primary" sx={{ fontWeight: 700 }} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            USPTO Full Specification Specification Record
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<BookmarkIcon />}>
            Save Bookmark
          </Button>
          <Button variant="contained" startIcon={<CompareIcon />} onClick={() => navigate(`/search/compare?target=${patId}`)}>
            Compare Claims
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                System and Method for Deep Learning Feature Classification in Multi-Modal Sensor Networks
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Assignee: <strong>Cognitive AI Systems Corp</strong> | Inventors: Chen et al. | Published: 2023-12-19
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>ABSTRACT</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 4 }}>
                Methods and systems for training multi-layer neural network classifiers using dynamic feature extraction from multi-modal sensor arrays. The architecture incorporates dynamic loss weighting across multi-task attention blocks.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>INDEPENDENT CLAIM 1</Typography>
              <Paper sx={{ p: 3, bgcolor: 'background.default', fontFamily: 'monospace', borderRadius: 2 }}>
                1. A computer-implemented method comprising receiving sensor data streams, generating feature vectors using a convolutional neural network layer, and computing loss functions based on multi-task attention mechanisms.
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
