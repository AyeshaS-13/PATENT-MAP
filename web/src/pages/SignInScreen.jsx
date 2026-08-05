import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Link, Stack, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 8, p: 2 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Welcome Back to PATENT MAP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your CPC classification workspace
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box sx={{ textAlign: 'right' }}>
                <Link onClick={() => navigate('/auth/forgot-password')} sx={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                  Forgot Password?
                </Link>
              </Box>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link onClick={() => navigate('/auth/register')} sx={{ cursor: 'pointer', fontWeight: 700 }}>
                Create Account
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
