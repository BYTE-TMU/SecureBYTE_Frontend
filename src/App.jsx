import { useState } from 'react';
import { createSubmission } from './api';
import { SidebarProvider } from './components/ui/sidebar';
import AppSidebar from './components/custom-components/AppSidebar';
import NavigationBar from './components/custom-components/NavigationBar';
import AppHeader from './components/custom-components/AppHeader';
import { useAuth } from './hooks/auth/AuthContext';
import { Outlet } from 'react-router';
import { GithubAuthProvider } from 'firebase/auth';

function App() {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const githubProvider = new GithubAuthProvider();
  githubProvider.addScope('read:user');
  githubProvider.addScope('user:email');

  // Submission form state
  const [newSecurityRev, setNewSecurityRev] = useState('');
  const [newLogicRev, setNewLogicRev] = useState('');
  const [newTestCases, setNewTestCases] = useState('');
  const [newReviewPdf, setNewReviewPdf] = useState('');

  const handleCreateSubmissionWithFields = async () => {
    if (!newSubmissionFilename.trim() || !projectId || !user) return;
    try {
      await createSubmission(user.uid, projectId, {
        filename: newSubmissionFilename,
        code: newSubmissionCode || '',
        securityrev: newSecurityRev ? [newSecurityRev] : [],
        logicrev: newLogicRev ? [newLogicRev] : [],
        testcases: newTestCases ? [newTestCases] : [],
        reviewpdf: newReviewPdf,
      });
      setNewSecurityRev('');
      setNewLogicRev('');
      setNewTestCases('');
      setNewReviewPdf('');
      setError('');
    } catch (error) {
      console.error('Error creating submission:', error);
      setError('Failed to create submission.');
    }
  };

  if (user) {
    return (
      <SidebarProvider defaultOpen={false} name={'primary_sidebar'}>
        <NavigationBar />
        <AppSidebar />
        <main className="w-screen">
          <AppHeader />
          {/* <DashboardPage
            setCurrentView={setCurrentView}
            newSecurityRev={newSecurityRev}
            setNewSecurityRev={setNewSecurityRev}
            newLogicRev={newLogicRev}
            setNewLogicRev={setNewLogicRev}
            newTestCases={newTestCases}
            setNewTestCases={setNewTestCases}
            newReviewPdf={newReviewPdf}
            setNewReviewPdf={setNewReviewPdf}
            handleCreateSubmissionWithFields={handleCreateSubmissionWithFields}
            editingSubmission={editingSubmission}
          /> */}
          <Outlet />
        </main>
      </SidebarProvider>
    );
  }
}

export default App;
