import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Chip, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useSelector } from 'react-redux';

export default function AccountSettingsScreen() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Account & Profile Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your user credentials, security sessions, and OTP verification status
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <AccountCircleIcon color="primary" sx={{ fontSize: 56 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {user?.name || 'Patent Analyst'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'analyst@patentmap.org'}
              </Typography>
              <Chip
                icon={<VerifiedIcon />}
                label="Email & OTP Verified"
                color="success"
                size="small"
                sx={{ mt: 1, fontWeight: 700 }}
              />
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2.5}>
            <TextField label="Full Name" defaultValue={user?.name || 'Patent Analyst'} fullWidth />
            <TextField label="Email Address" defaultValue={user?.email || 'analyst@patentmap.org'} disabled fullWidth />
            <Button variant="contained" size="large">Save Profile Changes</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
