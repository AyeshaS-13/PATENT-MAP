import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, TextField, InputAdornment, LinearProgress, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CompareIcon from '@mui/icons-material/Compare';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PriorArtSearchResultsScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('neural network classification sensor fusion');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([
    {
      patent_id: 'US11847520B2',
      title: 'System and Method for Deep Learning Feature Classification in Multi-Modal Sensor Networks',
      assignee: 'Cognitive AI Systems Corp',
      pub_date: '2023-12-19',
      cpc_code: 'G06N 3/02',
      similarity_score: 89.4,
      abstract: 'Methods and systems for training multi-layer neural network classifiers using dynamic feature extraction from multi-modal sensor arrays.'
    },
    {
      patent_id: 'US10932145B1',
      title: 'Decentralized Blockchain Verification Protocol with Zero-Knowledge Proof Authentication',
      assignee: 'Cipher Cryptographic Research',
      pub_date: '2021-02-23',
      cpc_code: 'H04L 9/32',
      similarity_score: 74.2,
      abstract: 'A cryptographic method for executing zero-knowledge proof verification across a peer-to-peer distributed ledger network.'
    },
    {
      patent_id: 'US11456901B2',
      title: 'Autonomous UAV Trajectory Optimization Using Real-Time Sensor Fusion',
      assignee: 'AeroDynamics Flight Labs',
      pub_date: '2022-09-27',
      cpc_code: 'B64C 39/02',
      similarity_score: 68.5,
      abstract: 'Flight control system for unmanned aerial vehicles adjusting rotor thrust based on LIDAR and optical sensor fusion algorithms.'
    }
  ]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('patent_map_token');
      const res = await axios.post('/api/search/prior-art', { queryText: query }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.data) {
        setResults(res.data.data);
      }
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Prior Art Search Results
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        BM25 similarity scoring over USPTO & EPO patent corpus
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prior art by keywords or CPC code..."
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
              }}
            />
            <Button variant="contained" size="large" onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3}>
        {results.map((item, idx) => (
          <Grid item xs={12} key={idx}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 1.5 }}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {item.patent_id}
                      </Typography>
                      <Chip label={item.cpc_code} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 1, sm: 0 } }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>SIMILARITY SCORE</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: item.similarity_score > 80 ? 'success.main' : 'warning.main' }}>
                      {item.similarity_score}%
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {item.abstract}
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Assignee: <strong>{item.assignee}</strong> | Published: {item.pub_date}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" startIcon={<CompareIcon />} onClick={() => navigate(`/search/compare?target=${item.patent_id}`)}>
                      Side-by-Side Compare
                    </Button>
                    <Button size="small" variant="contained" onClick={() => navigate(`/search/patent-detail/${item.patent_id}`)}>
                      Full Details
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
