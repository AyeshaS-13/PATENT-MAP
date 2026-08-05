import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Button, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CPCExplorerMainScreen() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [taxonomy, setTaxonomy] = useState({ sections: [] });

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const token = localStorage.getItem('patent_map_token');
        const res = await axios.get('/api/cpc/taxonomy', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.data?.data) {
          setTaxonomy(res.data.data);
        }
      } catch (e) {
        // Handled
      }
    };
    fetchTaxonomy();
  }, []);

  const handleInspect = (code) => {
    navigate(`/explorer/cpc-detail/${encodeURIComponent(code)}`);
  };

  const sectionsToDisplay = taxonomy.sections || [];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        CPC Taxonomy Hierarchy Explorer
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Browse Cooperative Patent Classification sections A through H, subclasses, and group definitions
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search CPC code (e.g. G06F 18/20) or classification title..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
            }}
          />
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {sectionsToDisplay.map((sec) => (
          <Accordion key={sec.code} defaultExpanded={sec.code === 'G'} sx={{ borderRadius: '12px !important', overflow: 'hidden' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={`Section ${sec.code}`} color="primary" sx={{ fontWeight: 800 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{sec.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{sec.description}</Typography>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              {sec.classes?.map((cls) => (
                <Box key={cls.code} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                    Class {cls.code} - {cls.title}
                  </Typography>

                  {cls.subclasses?.map((sub) => (
                    <Box key={sub.code} sx={{ p: 2, mb: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                        Subclass {sub.code}: {sub.title}
                      </Typography>
                      <List dense disablePadding>
                        {sub.groups?.map((grp) => (
                          <ListItem
                            key={grp.code}
                            sx={{ borderRadius: 1.5, my: 0.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}
                          >
                            <Chip label={grp.code} size="small" color="secondary" sx={{ mr: 2, fontWeight: 700 }} />
                            <ListItemText primary={grp.description} />
                            <Button size="small" variant="outlined" onClick={() => handleInspect(grp.code)}>
                              Inspect
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}
