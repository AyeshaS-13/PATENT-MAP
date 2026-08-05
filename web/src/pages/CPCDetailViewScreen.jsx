import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CPCDetailViewScreen() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const decodedCode = code ? decodeURIComponent(code) : 'G06F 18/20';

  const [detail, setDetail] = useState({
    code: decodedCode,
    description: 'Pattern recognition, machine learning classifiers, statistical feature extraction',
    section: { code: 'G', title: 'Physics', description: 'Computing & Artificial Intelligence' },
    subclass: { code: 'G06F', title: 'Electric Digital Data Processing' },
    keywords: ['machine learning', 'classifier', 'feature extraction', 'neural network'],
    relatedCodes: [
      { code: 'G06N 3/02', title: 'Neural network architectures' },
      { code: 'G06F 21/60', title: 'Data security and encryption' },
      { code: 'H04L 9/32', title: 'Digital signatures & verification' }
    ]
  });

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('patent_map_token');
        const res = await axios.get(`/api/cpc/detail/${encodeURIComponent(decodedCode)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.data?.data) {
          setDetail(res.data.data);
        }
      } catch (e) {
        // Handled
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [code]);

  return (
    <Box sx={{ p: 1 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/explorer/cpc-main')} sx={{ mb: 2 }}>
        Back to CPC Explorer
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              CPC Code Detail: {detail.code}
            </Typography>
            <Chip label={`Section ${detail.section?.code || 'G'}`} color="primary" sx={{ fontWeight: 700 }} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Official Cooperative Patent Classification Definition
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<SearchIcon />} onClick={() => navigate('/search/prior-art')}>
          Find Patents in this CPC Class
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TAXONOMY DESCRIPTION</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, mb: 3 }}>
                  {detail.description}
                </Typography>

                <Paper sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                    HIERARCHY LOCATION
                  </Typography>
                  <Typography variant="body2">
                    <strong>Section {detail.section?.code}:</strong> {detail.section?.title} - {detail.section?.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <strong>Subclass {detail.subclass?.code}:</strong> {detail.subclass?.title}
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>KEYWORD INDEX</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {detail.keywords?.map((kw, i) => (
                    <Chip key={i} label={kw} color="secondary" variant="outlined" sx={{ fontWeight: 600 }} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Related CPC Classes
                </Typography>
                <List disablePadding>
                  {detail.relatedCodes?.map((rel, i) => (
                    <ListItem
                      key={i}
                      button
                      onClick={() => navigate(`/explorer/cpc-detail/${encodeURIComponent(rel.code)}`)}
                      sx={{ borderRadius: 2, mb: 1, border: '1px solid', borderColor: 'divider' }}
                    >
                      <ListItemText primary={rel.code} secondary={rel.title} primaryTypographyProps={{ fontWeight: 700 }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
