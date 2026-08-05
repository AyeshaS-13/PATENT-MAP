import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const searches = [
  { title: 'Neural Network Sensor Query', query: '(TTL/("neural network") OR AB/("classification")) AND CPC/G06F18/20', date: '2026-07-30' },
  { title: 'Blockchain Verification Query', query: '(blockchain AND zero-knowledge) IN AB AND H04L9/32 IN CPC', date: '2026-07-29' }
];

export default function SavedSearchesScreen() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Saved Prior Art Searches
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Re-execute stored USPTO and EPO search query strings
      </Typography>

      <Grid container spacing={3}>
        {searches.map((s, i) => (
          <Grid item xs={12} key={i}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{s.title}</Typography>
                  <Typography variant="caption" color="text.secondary">Saved on {s.date}</Typography>
                </Stack>
                <Paper sx={{ p: 2, bgcolor: 'background.default', fontFamily: 'monospace', borderRadius: 2, mb: 2 }}>
                  {s.query}
                </Paper>
                <Button variant="contained" size="small" startIcon={<SearchIcon />} onClick={() => navigate('/search/prior-art')}>
                  Run Saved Search
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
