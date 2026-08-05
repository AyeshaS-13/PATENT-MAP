import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CPCRecommendationScreen() {
  const navigate = useNavigate();
  const { currentPatent } = useSelector((state) => state.patent);

  const cpcList = currentPatent?.cpcRecommendations || [
    { cpc_code: 'G06F 18/20', description: 'Pattern recognition, machine learning classifiers, statistical feature extraction', section: 'G', subclass: 'G06F', confidence: 94.2 },
    { cpc_code: 'G06N 3/02', description: 'Neural network architectures, deep learning, artificial neural systems', section: 'G', subclass: 'G06N', confidence: 88.7 },
    { cpc_code: 'H04L 9/32', description: 'Arrangements for verifying identity, digital signatures, blockchain authentication', section: 'H', subclass: 'H04L', confidence: 72.1 }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            CPC Code Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ranked Cooperative Patent Classification (CPC) codes based on BM25 + ML classifier
          </Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/processing/ai-explanation')}>
          Next: AI Explanation
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>CPC Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Taxonomy Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Section / Subclass</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>ML Confidence Score</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cpcList.map((item, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Chip label={item.cpc_code} color="primary" sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 350 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">Section {item.section} ({item.subclass})</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: item.confidence > 85 ? 'success.main' : 'warning.main' }}>
                        {item.confidence}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => navigate(`/explorer/cpc-detail/${item.cpc_code.replace(/\s+/g, '')}`)}>
                        Inspect Class
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
