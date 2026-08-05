import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Stack, Button, Chip } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DomainDetectionResultScreen() {
  const navigate = useNavigate();
  const { currentPatent } = useSelector((state) => state.patent);

  const domainData = currentPatent?.domainData || {
    dominant_domain: { name: 'Artificial Intelligence & Machine Learning', percentage: 76.5 },
    dependent_domains: [
      { name: 'Cryptography & Cybersecurity', percentage: 18.2 },
      { name: 'Wireless & Telecommunications', percentage: 5.3 }
    ]
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Domain Detection Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Multi-domain percentage classification predicted via TF-IDF & hybrid models
          </Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/processing/cpc-recommend')}>
          Next: CPC Recommendations
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                DOMINANT TECHNOLOGY DOMAIN
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {domainData.dominant_domain.name}
                </Typography>
                <Chip label={`${domainData.dominant_domain.percentage}%`} color="primary" sx={{ fontWeight: 800, fontSize: '1.1rem' }} />
              </Stack>
              <LinearProgress variant="determinate" value={domainData.dominant_domain.percentage} sx={{ height: 12, borderRadius: 6, mb: 4 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                DEPENDENT & SECONDARY DOMAINS
              </Typography>
              <Stack spacing={2.5}>
                {domainData.dependent_domains.map((dep, i) => (
                  <Box key={i}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{dep.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>{dep.percentage}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={dep.percentage} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Classification Rationale
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                The patent content was processed against 7 standardized technology domain vocabularies. Over 92% of the extracted claim n-grams aligned with neural network, gradient loss, and feature vector specifications.
              </Typography>

              <Button variant="outlined" fullWidth onClick={() => navigate('/processing/ai-explanation')}>
                View Detailed Feature Importance
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
