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
      navigate('/dashboard/overview');
    }
  };

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 6, p: 2 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Sign In to PATENT MAP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access your saved CPC classifications, reports, and prior art searches
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  EMAIL ADDRESS
                </Typography>
                <TextField
                  name="user_signin_email"
                  type="email"
                  fullWidth
                  required
                  autoComplete="off"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  PASSWORD
                </Typography>
                <TextField
                  name="user_signin_password"
                  type="password"
                  fullWidth
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>

              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.5, fontWeight: 800 }}>
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
