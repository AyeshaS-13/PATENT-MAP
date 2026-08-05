import React from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

export default function AuditLogsScreen() {
  const logs = [
    { timestamp: '2026-07-31 10:45:12', user: 'analyst@patentmap.org', action: 'PATENT_UPLOAD', details: 'Uploaded PDF file multi_modal_sensor_patent.pdf' },
    { timestamp: '2026-07-31 10:45:15', user: 'analyst@patentmap.org', action: 'CPC_RECOMMEND', details: 'Predicted top CPC code G06F 18/20 (94.2%)' },
    { timestamp: '2026-07-31 10:46:01', user: 'analyst@patentmap.org', action: 'QUERY_GENERATE', details: 'Generated USPTO boolean search query' },
    { timestamp: '2026-07-31 10:47:30', user: 'analyst@patentmap.org', action: 'REPORT_EXPORT', details: 'Exported patent dossier report REP-89412 in PDF format' }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        System Audit Logs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Immutable security & system execution audit trail
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>User Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action Code</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Execution Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.timestamp}</Typography></TableCell>
                <TableCell><Typography variant="body2">{row.user}</Typography></TableCell>
                <TableCell><Chip label={row.action} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{row.details}</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
