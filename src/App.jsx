import React, { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from 'firebase/auth';
import { app } from './firebase';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from './api';

import LoginPage from './components/pages/SignUpPage';
import SignupPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/DashboardPage';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import AppSidebar from './components/custom-components/AppSidebar';
import NavigationBar from './components/custom-components/NavigationBar';
import AppHeader from './components/custom-components/AppHeader';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from './hooks/auth/AuthContext';
import { ProjectProvider } from './hooks/project/ProjectContext';


const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
// Optional scopes for email access
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

function App() {
  const { user, loading } = useAuth();

  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Submission form state
  const [newSubmissionFilename, setNewSubmissionFilename] = useState('');
  const [newSubmissionCode, setNewSubmissionCode] = useState('');
  const [newSecurityRev, setNewSecurityRev] = useState('');
  const [newLogicRev, setNewLogicRev] = useState('');
  const [newTestCases, setNewTestCases] = useState('');
  const [newReviewPdf, setNewReviewPdf] = useState('');
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editSubmissionFilename, setEditSubmissionFilename] = useState('');
  const [editSubmissionCode, setEditSubmissionCode] = useState('');

  // Route navigation
  const navigate = useNavigate();

  const handleCreateSubmissionWithFields = async () => {
    if (!newSubmissionFilename.trim() || !selectedProject || !user) return;
    try {
      await createSubmission(user.uid, selectedProject.projectid, {
        filename: newSubmissionFilename,
        code: newSubmissionCode || '',
        securityrev: newSecurityRev ? [newSecurityRev] : [],
        logicrev: newLogicRev ? [newLogicRev] : [],
        testcases: newTestCases ? [newTestCases] : [],
        reviewpdf: newReviewPdf,
      });
      setNewSubmissionFilename('');
      setNewSubmissionCode('');
      setNewSecurityRev('');
      setNewLogicRev('');
      setNewTestCases('');
      setNewReviewPdf('');
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error creating submission:', error);
      setError('Failed to create submission.');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Temporary loading view
  }

  if (user) {
    return (
      <ProjectProvider autoFetch={true}>
        <SidebarProvider defaultOpen={false} name={'primary_sidebar'}>
          <NavigationBar isSignedIn={isSignUp} />
          <AppSidebar />
          <main className="w-screen">
            <AppHeader />
            <Outlet />
          </main>
        </SidebarProvider>
      </ProjectProvider>
    );
  }

  return null;
}

export default App;
