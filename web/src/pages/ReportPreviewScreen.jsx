import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Paper, Divider } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate } from 'react-router-dom';

export default function ReportPreviewScreen() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Patent Dossier Report Preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Official Patent Classification & Prior Art Dossier (#REP-89412)
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
            Print Preview
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => navigate('/reports/export')}>
            Export Report
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ p: 4 }}>
        <Box sx={{ borderBottom: 2, borderColor: 'primary.main', pb: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              PATENT MAP DOSSIER REPORT
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Cooperative Patent Classification & Prior Art Dossier
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>REPORT ID: REP-89412</Typography>
            <Typography variant="caption" color="text.secondary">DATE: {new Date().toLocaleDateString()}</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>1. INVENTION TITLE</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              System and Method for Deep Learning Feature Classification in Multi-Modal Sensor Networks
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>2. DOMAIN CLASSIFICATION</Typography>
            <Paper sx={{ p: 2, mt: 1, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Dominant Domain: Artificial Intelligence & Machine Learning (76.5%)</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Dependent Domains: Cryptography & Cybersecurity (18.2%), Wireless Communication (5.3%)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>3. RECOMMENDED CPC CODES</Typography>
            <Paper sx={{ p: 2, mt: 1, bgcolor: 'background.default', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip label="G06F 18/20 (94.2%)" color="primary" size="small" />
                <Chip label="G06N 3/02 (88.7%)" color="secondary" size="small" />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Pattern recognition, machine learning classifiers & neural network architectures
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mt: 2 }}>4. AI CLASSIFICATION RATIONALE</Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, mt: 1 }}>
              The system assigned classification code G06F 18/20 based on strong semantic overlap across claims and description sections. Key technical markers including neural network, classifier, and loss function demonstrate high correlation with standard USPTO classification guidelines.
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
