import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import PrivateRoute from './utils/ProtectedRoute';
import './index.css';
import App from './App.jsx';
import DashboardPage from './components/pages/DashboardPage';
import CodeEditorPage from './components/pages/CodeEditorPage';
import CoreLayout from './components/layouts/CoreLayout';
import { SidebarProvider } from './components/ui/sidebar';
import IndividualProjectPage from './components/pages/IndividualProjectPage';
import { AuthProvider, useAuth } from './hooks/auth/AuthContext';
import AuthLayout from './components/layouts/AuthLayout';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import ProtectedRoute from './utils/ProtectedRoute';

createRoot(document.getElementById('root')).render(
  // LATER: Separate routes into different groups (e.g., public, authentication, protected) when landing page is added. 
  <BrowserRouter>
    <AuthProvider>
      {/* Authentication routes */}
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          {console.log('About to read authentication from main.jsx')}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<App />}>
            <Route path="/code-editor" element={<CodeEditorPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects">
              <Route path=":projectId" element={<IndividualProjectPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
