import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Paper, Divider, Alert } from '@mui/material';
import CompareIcon from '@mui/icons-material/Compare';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function PatentComparisonViewScreen() {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('target') || 'US11847520B2';
  
  const [comparison, setComparison] = useState({
    target_patent_id: targetId,
    target_title: 'System and Method for Deep Learning Feature Classification',
    overall_similarity_percentage: 78.5,
    shared_technical_elements: ['neural network', 'feature vector', 'sensor array', 'classification'],
    novel_patent_differentiators: ['dynamic loss weighting', 'real-time haptic feedback'],
    claim_comparison: {
      source_claim_summary: '1. A computer-implemented method comprising receiving multi-modal sensor streams and training multi-task attention blocks.',
      prior_art_claim_summary: '1. A computer-implemented method comprising receiving sensor streams, generating feature vectors using CNN layers...',
      overlap_verdict: 'Moderate claim overlap detected. Novelty resides in specific dynamic loss weighting algorithm.'
    }
  });

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Side-by-Side Patent Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comparative claim alignment and novelty differentiation analysis
          </Typography>
        </Box>
        <Chip
          label={`Overall Similarity: ${comparison.overall_similarity_percentage}%`}
          color={comparison.overall_similarity_percentage > 80 ? 'warning' : 'success'}
          sx={{ fontWeight: 800, fontSize: '1rem', py: 2, px: 1 }}
        />
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Verdict:</strong> {comparison.claim_comparison.overlap_verdict}
      </Alert>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>YOUR PATENT SPECIFICATION</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, mb: 2 }}>
              Multi-Modal Neural Sensor Classification System
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontFamily: 'monospace' }}>
              {comparison.claim_comparison.source_claim_summary}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="caption" color="secondary" sx={{ fontWeight: 700 }}>PRIOR ART: {comparison.target_patent_id}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, mb: 2 }}>
              {comparison.target_title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontFamily: 'monospace' }}>
              {comparison.claim_comparison.prior_art_claim_summary}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <CheckCircleIcon color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Overlapping Technical Features</Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {comparison.shared_technical_elements.map((elem, i) => (
                  <Chip key={i} label={elem} color="warning" variant="outlined" sx={{ fontWeight: 600 }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Novel Patent Differentiators</Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {comparison.novel_patent_differentiators.map((elem, i) => (
                  <Chip key={i} label={elem} color="success" sx={{ fontWeight: 700 }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
