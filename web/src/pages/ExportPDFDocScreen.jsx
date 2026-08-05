import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio, Button, Stack, Alert, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

export default function ExportPDFDocScreen() {
  const [format, setFormat] = useState('PDF');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      // Trigger browser file download blob simulation
      const blob = new Blob(['PATENT MAP OFFICIAL DOSSIER REPORT\n\nTitle: System and Method for Deep Learning Feature Classification\nCPC Code: G06F 18/20\nDomain: Artificial Intelligence & Machine Learning (76.5%)\nConfidence: 94.2%'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patent_dossier_REP89412.${format.toLowerCase()}`;
      a.click();
    }, 1500);
  };

  return (
    <Box sx={{ maxWidth: 550, mx: 'auto', mt: 4, p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Export Patent Dossier
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select your export format to download complete patent classification analysis
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {downloaded && <Alert severity="success" sx={{ mb: 3 }}>Report downloaded successfully!</Alert>}

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>SELECT EXPORT FORMAT</Typography>
          <RadioGroup value={format} onChange={(e) => setFormat(e.target.value)} sx={{ mb: 4 }}>
            <FormControlLabel value="PDF" control={<Radio />} label={<Stack direction="row" spacing={1} alignItems="center"><PictureAsPdfIcon color="error" /><Typography variant="body1" sx={{ fontWeight: 600 }}>PDF Document (.pdf)</Typography></Stack>} />
            <FormControlLabel value="DOC" control={<Radio />} label={<Stack direction="row" spacing={1} alignItems="center"><DescriptionIcon color="primary" /><Typography variant="body1" sx={{ fontWeight: 600 }}>Microsoft Word Document (.docx)</Typography></Stack>} />
          </RadioGroup>

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<DownloadIcon />}
            disabled={downloading}
            onClick={handleExport}
          >
            {downloading ? <CircularProgress size={24} color="inherit" /> : `Download ${format} Dossier`}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
