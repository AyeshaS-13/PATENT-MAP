import React from 'react';
import { Box, Card, CardContent, Typography, Grid, RadioGroup, FormControlLabel, Radio, Stack, Paper, Alert } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useAppTheme } from '../theme/ThemeContext';

export default function ThemeSettingsScreen() {
  const { themeMode, setThemeMode, actualMode } = useAppTheme();

  return (
    <Box sx={{ maxWidth: 650, mx: 'auto', p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Theme Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select your application theme mode. Active theme: <strong>{themeMode.toUpperCase()}</strong> (Resolved: {actualMode.toUpperCase()})
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            PATENT MAP supports Light, Dark, and System automatic theme matching.
          </Alert>

          <RadioGroup value={themeMode} onChange={(e) => setThemeMode(e.target.value)}>
            <Grid container spacing={2}>
              {[
                { value: 'light', label: 'Light Theme', desc: 'Clean high-contrast light aesthetics', icon: <Brightness7Icon color="primary" sx={{ fontSize: 32 }} /> },
                { value: 'dark', label: 'Dark Theme', desc: 'Modern sleek dark mode for long research sessions', icon: <Brightness4Icon color="primary" sx={{ fontSize: 32 }} /> },
                { value: 'system', label: 'System Default', desc: 'Syncs automatically with operating system theme preference', icon: <SettingsBrightnessIcon color="primary" sx={{ fontSize: 32 }} /> }
              ].map((item) => {
                const isSelected = themeMode === item.value;
                return (
                  <Grid item xs={12} key={item.value}>
                    <Paper
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        bgcolor: isSelected ? 'action.selected' : 'background.paper'
                      }}
                      onClick={() => setThemeMode(item.value)}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Radio checked={isSelected} value={item.value} />
                        {item.icon}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </RadioGroup>
        </CardContent>
      </Card>
    </Box>
  );
}
