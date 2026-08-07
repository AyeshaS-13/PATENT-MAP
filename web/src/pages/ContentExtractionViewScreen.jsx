import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Button, Stack, Paper, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScannerIcon from '@mui/icons-material/Scanner';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ContentExtractionViewScreen() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('ENGLISH');
  const { currentPatent } = useSelector((state) => state.patent);

  const ext = currentPatent?.extraction || currentPatent?.patent || {};

  const englishTitle = ext.title || 'System and Method for Deep Learning Feature Classification in Multi-Modal Sensor Networks';
  const englishAbstract = ext.abstract || 'Methods and systems for training multi-layer neural network classifiers using dynamic feature extraction from multi-modal sensor arrays.';
  const englishClaims = ext.claims || '1. A computer-implemented method comprising receiving sensor data streams, generating feature vectors using a convolutional neural network layer, and computing loss functions based on multi-task attention mechanisms.';
  const englishDescription = ext.description || 'The present invention relates generally to artificial intelligence and deep neural network architecture optimization...';

  const origTitle = ext.original_title || englishTitle;
  const origAbstract = ext.original_abstract || englishAbstract;
  const origClaims = ext.original_claims || englishClaims;
  const origDescription = ext.original_description || englishDescription;

  const translationUsed = ext.translation_used || false;
  const origLang = ext.original_language || 'en';
  const translationWarning = ext.translation_warning;

  const displayTitle = viewMode === 'ORIGINAL' ? origTitle : englishTitle;
  const displayAbstract = viewMode === 'ORIGINAL' ? origAbstract : englishAbstract;
  const displayClaims = viewMode === 'ORIGINAL' ? origClaims : englishClaims;
  const displayDescription = viewMode === 'ORIGINAL' ? origDescription : englishDescription;

  const extractionMethod = ext.extraction_method || 'STANDARD_TEXT';
  const isOcr = ext.is_ocr || extractionMethod === 'OCR_EXTRACTED';

  const handleDownloadText = () => {
    const formattedContent = `PATENT EXTRACTED SECTIONS
========================================
Language: ${origLang.toUpperCase()} | Translation Used: ${translationUsed}

TITLE:
${displayTitle}

----------------------------------------
ABSTRACT:
${displayAbstract}

----------------------------------------
CLAIMS:
${displayClaims}

----------------------------------------
DETAILED DESCRIPTION:
${displayDescription}

========================================
Extraction Mode: ${isOcr ? 'OCR Engine' : 'Standard PDF Parser'}
Date: ${new Date().toLocaleString()}
`;

    const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted_patent_sections_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify({
      title: displayTitle,
      abstract: displayAbstract,
      claims: displayClaims,
      description: displayDescription,
      originalText: {
        title: origTitle,
        abstract: origAbstract,
        claims: origClaims,
        description: origDescription
      },
      metadata: {
        extractionMethod,
        isOcr,
        originalLanguage: origLang,
        translationUsed,
        translationWarning,
        extractedAt: new Date().toISOString()
      }
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted_patent_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Extracted Patent Sections
            </Typography>
            <Chip
              icon={isOcr ? <ScannerIcon fontSize="small" /> : <PictureAsPdfIcon fontSize="small" />}
              label={isOcr ? 'OCR Engine Used' : 'PDF Text Extracted'}
              color={isOcr ? 'warning' : 'success'}
              variant="filled"
              size="small"
              sx={{ fontWeight: 700 }}
            />
            {translationUsed && (
              <Chip
                icon={<TranslateIcon fontSize="small" />}
                label={`Translated: ${origLang.toUpperCase()} → EN`}
                color="info"
                variant="filled"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            NLP parsing & section extraction results for Title, Abstract, Claims, and Description
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          {translationUsed && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              size="small"
            >
              <ToggleButton value="ENGLISH" sx={{ fontWeight: 700 }}>
                English View
              </ToggleButton>
              <ToggleButton value="ORIGINAL" sx={{ fontWeight: 700 }}>
                Original ({origLang.toUpperCase()})
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadText}>
            Download TXT
          </Button>
          <Button variant="outlined" startIcon={<DescriptionIcon />} onClick={handleDownloadJSON}>
            Download JSON
          </Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/processing/domain')}>
            Next: Domain Detection
          </Button>
        </Stack>
      </Stack>

      {translationWarning && (
        <Alert severity={translationUsed ? "info" : "warning"} icon={<LanguageIcon />} sx={{ mb: 3 }}>
          {translationWarning}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                PATENT TITLE {viewMode === 'ORIGINAL' ? `(${origLang.toUpperCase()})` : '(ENGLISH ANALYSIS)'}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                {displayTitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              ABSTRACT SECTION {viewMode === 'ORIGINAL' ? `(${origLang.toUpperCase()})` : '(ENGLISH)'}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {displayAbstract}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              CLAIMS SECTION {viewMode === 'ORIGINAL' ? `(${origLang.toUpperCase()})` : '(ENGLISH)'}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontFamily: 'monospace' }}>
              {displayClaims}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
              DETAILED DESCRIPTION PREVIEW {viewMode === 'ORIGINAL' ? `(${origLang.toUpperCase()})` : '(ENGLISH)'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {displayDescription}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}


