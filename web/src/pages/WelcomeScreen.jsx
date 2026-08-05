import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Stack, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Chip
                icon={<AutoAwesomeIcon />}
                label="AI-Powered CPC Patent Classifier v1.0"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.15 }}>
                Accelerate Patent Classification with AI Precision
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                PATENT MAP automatically extracts patent claims, classifies domain hierarchies, predicts Cooperative Patent Classification (CPC) codes, explains AI rationale, and retrieves prior art with 100% test validation.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button variant="contained" size="large" onClick={() => navigate('/auth/register')} sx={{ py: 1.5, px: 4, fontSize: '1rem' }}>
                  Create Free Account
                </Button>
                <Button variant="outlined" size="large" onClick={() => navigate('/auth/signin')} sx={{ py: 1.5, px: 4, fontSize: '1rem' }}>
                  Sign In
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {[
                { title: '1. Instant PDF & Text Parsing', desc: 'Auto-extract Title, Abstract, Claims, and Detailed Description.', icon: <AutoAwesomeIcon color="primary" /> },
                { title: '2. Domain Classification', desc: 'Predict Dominant and Dependent technology domain percentages.', icon: <AccountTreeIcon color="secondary" /> },
                { title: '3. CPC Code Recommendation', desc: 'Ranks G06F, G06N, H04L, A61K taxonomy classes with ML scoring.', icon: <SearchIcon color="primary" /> },
                { title: '4. Prior Art & Side-by-Side', desc: 'BM25 prior art retrieval and side-by-side claim comparison.', icon: <SecurityIcon color="secondary" /> }
              ].map((card, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Card sx={{ height: '100%', p: 1 }}>
                    <CardContent>
                      <Box sx={{ mb: 1.5 }}>{card.icon}</Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
