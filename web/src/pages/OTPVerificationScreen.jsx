import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack, CircularProgress, Chip } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, clearAuthError } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function OTPVerificationScreen() {
  const { otpPendingEmail, sampleOtp, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(otpPendingEmail || 'user@example.com');
  const [otp, setOtp] = useState(sampleOtp || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const res = await dispatch(verifyOTP({ email, otp }));
    if (verifyOTP.fulfilled.match(res)) {
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 8, p: 2 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <MarkEmailReadIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Email OTP Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the 6-digit verification code sent to your email address
            </Typography>
          </Box>

          {sampleOtp && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Demo Verification OTP: <strong>{sampleOtp}</strong>
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Target Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="6-Digit OTP Code"
                fullWidth
                required
                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '6px', fontSize: '1.2rem', fontWeight: 'bold' } }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code & Sign In'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
