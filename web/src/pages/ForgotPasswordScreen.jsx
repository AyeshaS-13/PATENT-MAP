import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link, Stack } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 8, p: 2 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LockResetIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your registered email address to receive password reset instructions
            </Typography>
          </Box>

          {sent ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset link and OTP have been dispatched to <strong>{email}</strong>.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Send Reset Link
                </Button>
              </Stack>
            </form>
          )}

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link onClick={() => navigate('/auth/signin')} sx={{ cursor: 'pointer', fontWeight: 600 }}>
              Back to Sign In
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
