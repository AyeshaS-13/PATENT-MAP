import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Button, Stack, CircularProgress } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RecentActivityScreen() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('patent_map_token');
        if (token) {
          const res = await axios.get('/api/patent/list', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data?.data) {
            const userPatents = res.data.data;
            const items = userPatents.map(pat => ({
              action: `Uploaded Patent Specification (${pat.sourceType})`,
              detail: pat.title,
              time: new Date(pat.createdAt).toLocaleString(),
              type: 'upload',
              path: '/processing/extraction'
            }));
            setActivities(items);
          }
        }
      } catch (err) {
        // Empty state
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Recent Activity Log
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Real-time chronological audit of your uploaded patent specifications and classifications
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
          ) : activities.length > 0 ? (
            <List>
              {activities.map((act, i) => (
                <ListItem key={i} sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <CloudUploadIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={act.action}
                    secondary={act.detail}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip label={act.time} size="small" variant="outlined" />
                    <Button size="small" variant="outlined" onClick={() => navigate(act.path)}>
                      View Details
                    </Button>
                  </Stack>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <HistoryIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>No Activity Found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You haven't uploaded or analyzed any patent documents yet.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/upload/pdf')}>
                Upload Your First Patent
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
