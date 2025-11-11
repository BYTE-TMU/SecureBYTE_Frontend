import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import './index.css';
import App from './App.jsx';
import DashboardPage from './components/pages/DashboardPage';
import CodeEditorPage from './components/pages/CodeEditorPage';
import IndividualProjectPage from './components/pages/IndividualProjectPage';
import { AuthProvider } from './hooks/auth/AuthContext';
import AuthLayout from './components/layouts/AuthLayout';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import ProtectedRoute from './utils/ProtectedRoute';
import LoadingPage from './components/pages/LoadingPage';
import SettingsLayout from './components/layouts/SettingsLayout';
import AccountSection from './components/custom-components/settings-sections/AccountSection';
import PreferencesSection from './components/custom-components/settings-sections/PreferencesSection';
import NotificationsSection from './components/custom-components/settings-sections/NotificationsSection';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      {/* Authentication routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth" element={<AuthLayout />}>
          {console.log('About to read authentication from main.jsx')}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<App />}>
            <Route
              path="/code-editor"
              element={<CodeEditorPage className="overflow-y-hidden" />}
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route path="account" element={<AccountSection />} />
              <Route path="preferences" element={<PreferencesSection />} />
              <Route path="notifications" element={<NotificationsSection />} />
            </Route>
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/projects">
              <Route path=":projectId" element={<IndividualProjectPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
