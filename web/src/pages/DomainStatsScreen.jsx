import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Stack, Paper } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function DomainStatsScreen() {
  const stats = [
    { domain: 'Artificial Intelligence & ML', count: 24, percentage: 50.0 },
    { domain: 'Cryptography & Cybersecurity', count: 12, percentage: 25.0 },
    { domain: 'Aerospace & Avionics', count: 6, percentage: 12.5 },
    { domain: 'Biotechnology & Genetics', count: 4, percentage: 8.3 },
    { domain: 'Wireless & Telecommunications', count: 2, percentage: 4.2 }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Technology Domain Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Statistical distribution across classified patent technology fields
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Domain Frequency Breakdown
              </Typography>
              <Stack spacing={3}>
                {stats.map((s, i) => (
                  <Box key={i}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>{s.domain}</Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 800 }}>{s.count} Patents ({s.percentage}%)</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={s.percentage * 1.5} sx={{ height: 10, borderRadius: 5 }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <AnalyticsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Analysis Insights</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Artificial Intelligence & Machine Learning accounts for 50% of all submitted patent specifications, with G06F 18/20 and G06N 3/02 emerging as the top assigned CPC classification codes.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
