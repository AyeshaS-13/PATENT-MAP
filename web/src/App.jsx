import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/authSlice';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth Pages
import WelcomeScreen from './pages/WelcomeScreen';
import SignInScreen from './pages/SignInScreen';
import OTPVerificationScreen from './pages/OTPVerificationScreen';
import CreateAccountScreen from './pages/CreateAccountScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';

// Dashboard Pages
import DashboardOverviewScreen from './pages/DashboardOverviewScreen';
import RecentActivityScreen from './pages/RecentActivityScreen';
import QuickUploadScreen from './pages/QuickUploadScreen';

// Upload Pages
import UploadPDFScreen from './pages/UploadPDFScreen';
import PasteAbstractClaimsScreen from './pages/PasteAbstractClaimsScreen';
import UploadProgressScreen from './pages/UploadProgressScreen';

// Processing Pages
import ContentExtractionViewScreen from './pages/ContentExtractionViewScreen';
import DomainDetectionResultScreen from './pages/DomainDetectionResultScreen';
import CPCRecommendationScreen from './pages/CPCRecommendationScreen';
import AIExplanationScreen from './pages/AIExplanationScreen';

// Search Pages
import QueryGenerationScreen from './pages/QueryGenerationScreen';
import PriorArtSearchResultsScreen from './pages/PriorArtSearchResultsScreen';
import PatentDetailViewScreen from './pages/PatentDetailViewScreen';
import PatentComparisonViewScreen from './pages/PatentComparisonViewScreen';

// Explorer Pages
import CPCExplorerMainScreen from './pages/CPCExplorerMainScreen';
import CPCDetailViewScreen from './pages/CPCDetailViewScreen';

// Reports Pages
import ReportPreviewScreen from './pages/ReportPreviewScreen';
import ExportPDFDocScreen from './pages/ExportPDFDocScreen';

// History Pages
import SavedPatentsScreen from './pages/SavedPatentsScreen';
import SavedSearchesScreen from './pages/SavedSearchesScreen';
import ReportsHistoryScreen from './pages/ReportsHistoryScreen';

// Settings & Analytics Pages
import ThemeSettingsScreen from './pages/ThemeSettingsScreen';
import AccountSettingsScreen from './pages/AccountSettingsScreen';
import DomainStatsScreen from './pages/DomainStatsScreen';
import AuditLogsScreen from './pages/AuditLogsScreen';

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const isAuthPage = location.pathname.startsWith('/auth') || location.pathname === '/';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {!isAuthPage && <Sidebar />}
        <Box component="main" sx={{ flexGrow: 1, p: isAuthPage ? 2 : 4, overflowY: 'auto', maxHeight: 'calc(100vh - 65px)' }}>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/auth/welcome" element={<WelcomeScreen />} />
            <Route path="/auth/signin" element={<SignInScreen />} />
            <Route path="/auth/verify-otp" element={<OTPVerificationScreen />} />
            <Route path="/auth/register" element={<CreateAccountScreen />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordScreen />} />

            <Route path="/dashboard" element={<DashboardOverviewScreen />} />
            <Route path="/dashboard/activity" element={<RecentActivityScreen />} />
            <Route path="/dashboard/quick-upload" element={<QuickUploadScreen />} />

            <Route path="/upload/pdf" element={<UploadPDFScreen />} />
            <Route path="/upload/paste" element={<PasteAbstractClaimsScreen />} />
            <Route path="/upload/progress" element={<UploadProgressScreen />} />

            <Route path="/processing/extraction" element={<ContentExtractionViewScreen />} />
            <Route path="/processing/domain" element={<DomainDetectionResultScreen />} />
            <Route path="/processing/cpc-recommend" element={<CPCRecommendationScreen />} />
            <Route path="/processing/ai-explanation" element={<AIExplanationScreen />} />

            <Route path="/search/query-gen" element={<QueryGenerationScreen />} />
            <Route path="/search/prior-art" element={<PriorArtSearchResultsScreen />} />
            <Route path="/search/patent-detail/:id" element={<PatentDetailViewScreen />} />
            <Route path="/search/compare" element={<PatentComparisonViewScreen />} />

            <Route path="/explorer/cpc-main" element={<CPCExplorerMainScreen />} />
            <Route path="/explorer/cpc-detail/:code" element={<CPCDetailViewScreen />} />

            <Route path="/reports/preview" element={<ReportPreviewScreen />} />
            <Route path="/reports/export" element={<ExportPDFDocScreen />} />

            <Route path="/history/saved-patents" element={<SavedPatentsScreen />} />
            <Route path="/history/saved-searches" element={<SavedSearchesScreen />} />
            <Route path="/history/reports-history" element={<ReportsHistoryScreen />} />

            <Route path="/settings/theme" element={<ThemeSettingsScreen />} />
            <Route path="/settings/account" element={<AccountSettingsScreen />} />
            <Route path="/analytics/domain-stats" element={<DomainStatsScreen />} />
            <Route path="/system/audit-logs" element={<AuditLogsScreen />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
