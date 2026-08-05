import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography, Badge } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import CompareIcon from '@mui/icons-material/Compare';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate, useLocation } from 'react-router-dom';

const navModules = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
      { label: 'Recent Activity', path: '/dashboard/activity', icon: <HistoryIcon /> },
      { label: 'Quick Upload', path: '/dashboard/quick-upload', icon: <CloudUploadIcon /> }
    ]
  },
  {
    title: 'Patent Upload & Extraction',
    items: [
      { label: 'Upload PDF', path: '/upload/pdf', icon: <CloudUploadIcon /> },
      { label: 'Paste Abstract/Claims', path: '/upload/paste', icon: <ArticleIcon /> },
      { label: 'Upload Progress', path: '/upload/progress', icon: <CloudUploadIcon /> }
    ]
  },
  {
    title: 'AI Processing & CPC',
    items: [
      { label: 'Content Extraction', path: '/processing/extraction', icon: <ArticleIcon /> },
      { label: 'Domain Detection', path: '/processing/domain', icon: <AnalyticsIcon /> },
      { label: 'CPC Recommendations', path: '/processing/cpc-recommend', icon: <CategoryIcon /> },
      { label: 'AI Rationale & Highlights', path: '/processing/ai-explanation', icon: <PsychologyIcon /> }
    ]
  },
  {
    title: 'Search & Prior Art',
    items: [
      { label: 'Query Generation', path: '/search/query-gen', icon: <SearchIcon /> },
      { label: 'Prior Art Results', path: '/search/prior-art', icon: <SearchIcon /> },
      { label: 'Patent Comparison', path: '/search/compare', icon: <CompareIcon /> }
    ]
  },
  {
    title: 'CPC Hierarchy Explorer',
    items: [
      { label: 'CPC Taxonomy Explorer', path: '/explorer/cpc-main', icon: <AccountTreeIcon /> },
      { label: 'CPC Class Details', path: '/explorer/cpc-detail/G06F18-20', icon: <AccountTreeIcon /> }
    ]
  },
  {
    title: 'Reports & Export',
    items: [
      { label: 'Report Preview', path: '/reports/preview', icon: <AssessmentIcon /> },
      { label: 'Export PDF / Doc', path: '/reports/export', icon: <AssessmentIcon /> }
    ]
  },
  {
    title: 'History & Saved',
    items: [
      { label: 'Saved Patents', path: '/history/saved-patents', icon: <BookmarkIcon /> },
      { label: 'Saved Searches', path: '/history/saved-searches', icon: <HistoryIcon /> },
      { label: 'Reports History', path: '/history/reports-history', icon: <AssessmentIcon /> }
    ]
  },
  {
    title: 'System & Preferences',
    items: [
      { label: 'Theme Settings (3 Modes)', path: '/settings/theme', icon: <SettingsIcon /> },
      { label: 'Account Settings', path: '/settings/account', icon: <SettingsIcon /> },
      { label: 'Domain Stats Analytics', path: '/analytics/domain-stats', icon: <AnalyticsIcon /> },
      { label: 'System Audit Logs', path: '/system/audit-logs', icon: <SecurityIcon /> }
    ]
  }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ width: 280, flexShrink: 0, py: 2, borderRight: 1, borderColor: 'divider', height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
      {navModules.map((mod, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.65rem' }}>
            {mod.title}
          </Typography>
          <List dense disablePadding sx={{ mt: 0.5 }}>
            {mod.items.map((item) => {
              const selected = location.pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding sx={{ px: 1.5, my: 0.2 }}>
                  <ListItemButton
                    selected={selected}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '& .MuiListItemIcon-root': { color: 'inherit' },
                        fontWeight: 700
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: selected ? 'inherit' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.825rem', fontWeight: selected ? 700 : 500 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
}
