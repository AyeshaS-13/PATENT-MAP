import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, CircularProgress, Alert } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SavedPatentsScreen() {
  const navigate = useNavigate();
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem('patent_map_token');
        if (token) {
          const res = await axios.get('/api/history/saved-patents', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data?.data) {
            setSavedList(res.data.data);
          }
        }
      } catch (err) {
        // Fallback demo data
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const items = savedList.length > 0 ? savedList.map(s => ({
    id: s.patent?.id || 'US11847520B2',
    title: s.patent?.title || 'System and Method for Deep Learning Feature Classification',
    cpc: s.patent?.cpcRecommendations?.[0]?.cpcCode || 'G06F 18/20',
    date: new Date(s.createdAt).toLocaleDateString()
  })) : [
    { id: 'US11847520B2', title: 'System and Method for Deep Learning Feature Classification', cpc: 'G06F 18/20', date: new Date().toLocaleDateString() },
    { id: 'US10932145B1', title: 'Decentralized Blockchain Verification Protocol', cpc: 'H04L 9/32', date: new Date().toLocaleDateString() }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Saved Patents & Bookmarks
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Access your bookmarked patent specifications and CPC classification records
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item, i) => (
            <Grid item xs={12} key={i}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <BookmarkIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{item.id.substring(0, 14)}</Typography>
                        <Chip label={item.cpc} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">Saved on {item.date}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => navigate(`/search/patent-detail/${item.id}`)}>
                      View Specification
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
