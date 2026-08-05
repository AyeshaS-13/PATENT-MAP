import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar, Chip, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppTheme } from '../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { themeMode, setThemeMode, actualMode } = useAppTheme();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  const getThemeIcon = () => {
    if (themeMode === 'light') return <Brightness7Icon />;
    if (themeMode === 'dark') return <Brightness4Icon />;
    return <SettingsBrightnessIcon />;
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', backdropFilter: 'blur(8px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <Box sx={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.2rem'
          }}>
            PM
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
              PATENT MAP
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
              CPC Classification & AI Assistance
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={`Theme: ${themeMode.toUpperCase()} (Click to toggle Light / Dark / System)`}>
            <IconButton onClick={toggleTheme} color="inherit">
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, fontSize: '0.75rem' }}>{user.name?.[0]}</Avatar>}
                label={user.name}
                variant="outlined"
                onClick={() => navigate('/settings/account')}
                sx={{ cursor: 'pointer', fontWeight: 600 }}
              />
              <IconButton color="error" onClick={() => { dispatch(logout()); navigate('/auth/signin'); }}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <Button variant="contained" size="small" onClick={() => navigate('/auth/signin')}>
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
