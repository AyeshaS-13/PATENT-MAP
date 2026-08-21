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
      navigate('/dashboard/overview');
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

          <form onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  FULL NAME
                </Typography>
                <TextField
                  name="user_full_name_input"
                  fullWidth
                  required
                  autoComplete="off"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  EMAIL ADDRESS
                </Typography>
                <TextField
                  name="user_registration_email"
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
                  PASSWORD (MIN 6 CHARACTERS)
                </Typography>
                <TextField
                  name="user_registration_new_password"
                  type="password"
                  fullWidth
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>

              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.5, fontWeight: 800 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account & Start'}
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
