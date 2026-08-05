import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, TextField, Stack, Paper, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function QueryGenerationScreen() {
  const navigate = useNavigate();
  const { currentPatent } = useSelector((state) => state.patent);

  const queryData = currentPatent?.queryData || {
    extracted_keywords: ['neural network', 'classification', 'feature vector', 'sensor', 'loss function'],
    primary_cpc_filter: 'G06F 18/20',
    uspto_syntax_query: '(TTL/("neural network") OR AB/("classification")) AND CPC/G06F18/20',
    epo_espacenet_syntax: '(neural AND network) IN AB AND G06F18/20 IN CPC',
    broad_patent_query: '(neural network OR classification) AND (CPC/G06F18/20)',
    narrow_claims_query: 'CLM/("neural network") AND CLM/("feature vector") AND CPC/G06F18/20'
  };

  const copyToClipboard = (str) => {
    navigator.clipboard.writeText(str);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Search Query Generation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Auto-generated Boolean search strings formatted for USPTO & EPO Espacenet
          </Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/search/prior-art')}>
          Execute Prior Art Search
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>USPTO Boolean Query</Typography>
                <Button size="small" startIcon={<ContentCopyIcon />} onClick={() => copyToClipboard(queryData.uspto_syntax_query)}>Copy</Button>
              </Stack>
              <Paper sx={{ p: 2, bgcolor: 'background.default', fontFamily: 'monospace', fontSize: '0.9rem', borderRadius: 2 }}>
                {queryData.uspto_syntax_query}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>EPO Espacenet Query</Typography>
                <Button size="small" startIcon={<ContentCopyIcon />} onClick={() => copyToClipboard(queryData.epo_espacenet_syntax)}>Copy</Button>
              </Stack>
              <Paper sx={{ p: 2, bgcolor: 'background.default', fontFamily: 'monospace', fontSize: '0.9rem', borderRadius: 2 }}>
                {queryData.epo_espacenet_syntax}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>EXTRACTED SEARCH KEYWORDS</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {queryData.extracted_keywords.map((kw, i) => (
                  <Chip key={i} label={kw} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                ))}
              </Stack>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>NARROW INDEPENDENT CLAIM QUERY</Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', fontFamily: 'monospace', fontSize: '0.9rem', borderRadius: 2, mb: 3 }}>
                {queryData.narrow_claims_query}
              </Paper>

              <Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={() => navigate('/search/prior-art')}>
                Run Live Search in Prior Art Engine
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
