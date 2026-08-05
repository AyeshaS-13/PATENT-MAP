import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Paper, LinearProgress } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AIExplanationScreen() {
  const navigate = useNavigate();
  const { currentPatent } = useSelector((state) => state.patent);

  const aiExp = currentPatent?.aiExplanation || {
    cpc_code: 'G06F 18/20',
    description: 'Pattern recognition, machine learning classifiers, statistical feature extraction',
    rationale: 'The system assigned classification code G06F 18/20 based on strong semantic overlap across claims and description sections. Key technical markers including neural network, classifier, loss function demonstrate high correlation with standard USPTO classification guidelines.',
    feature_importance: [
      { keyword: 'neural network', occurrences: 4, importance_score: 0.92 },
      { keyword: 'classifier', occurrences: 3, importance_score: 0.84 },
      { keyword: 'feature extraction', occurrences: 2, importance_score: 0.76 },
      { keyword: 'loss function', occurrences: 2, importance_score: 0.68 }
    ],
    text_highlights: [
      '...comprising receiving sensor data streams, generating feature vectors using a convolutional neural network layer...',
      '...computing loss functions based on multi-task attention mechanisms for pattern classification...'
    ]
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            AI Rationale & Attention Highlights
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Transparent feature importance explaining WHY CPC code {aiExp.cpc_code} was selected
          </Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/search/query-gen')}>
          Next: Search Query Gen
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <PsychologyIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Classification Rationale
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                {aiExp.rationale}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                TEXT HIGHLIGHT CONTEXT
              </Typography>
              <Stack spacing={1.5}>
                {aiExp.text_highlights.map((snippet, i) => (
                  <Paper key={i} sx={{ p: 2, bgcolor: 'background.default', borderLeft: '4px solid #6366f1', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontFamily: 'monospace' }}>
                      {snippet}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                Feature Importance Weights
              </Typography>
              <Stack spacing={2.5}>
                {aiExp.feature_importance.map((feat, idx) => (
                  <Box key={idx}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{feat.keyword}</Typography>
                      <Chip label={`${(feat.importance_score * 100).toFixed(0)}% (${feat.occurrences}x)`} size="small" color="primary" />
                    </Stack>
                    <LinearProgress variant="determinate" value={feat.importance_score * 100} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
