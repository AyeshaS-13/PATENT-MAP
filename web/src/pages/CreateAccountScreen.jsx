import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link, Stack, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const res = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(res)) {
      navigate('/auth/verify-otp');
    }
  };

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 6, p: 2 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Create PATENT MAP Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start parsing patents and recommending CPC codes in seconds
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password (min 6 chars)"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register & Get OTP'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link onClick={() => navigate('/auth/signin')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
