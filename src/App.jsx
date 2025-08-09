import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
  getAuth,
} from 'firebase/auth';
import { app } from './firebase';
import {
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
import { useAuth } from './hooks/auth/AuthContext';


// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

const githubProvider = new GithubAuthProvider();
// Optional scopes for email access
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');


function App() {
  // const [user, setUser] = useState(null);
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Project management state
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Project form state

  const [editingProject, setEditingProject] = useState(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');

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

  // View state
  const [currentView, setCurrentView] = useState('projects'); // 'projects' or 'submissions'

  const handleEditProject = (project) => {
    setEditingProject(project.projectid);
    setEditProjectName(project.project_name);
    setEditProjectDesc(project.project_desc || '');
  };

  const handleUpdateProject = async (projectId) => {
    if (!editProjectName.trim() || !user) return;

    try {
      await updateProject(user.uid, projectId, {
        project_name: editProjectName,
        project_desc: editProjectDesc,
      });
      setEditingProject(null);
      setEditProjectName('');
      setEditProjectDesc('');
      loadProjects();
      setError('');
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!user) return;
    try {
      await deleteProject(user.uid, projectId);
      if (selectedProject?.projectid === projectId) {
        setSelectedProject(null);
        setSubmissions([]);
        setCurrentView('projects');
      }
      loadProjects();
      setError('');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project.');
    }
  };

  const handleCancelProjectEdit = () => {
    setEditingProject(null);
    setEditProjectName('');
    setEditProjectDesc('');
  };

  // Submission management functions
  const loadSubmissions = async (projectId) => {
    if (!user || !projectId) return;
    try {
      const response = await getSubmissions(user.uid, projectId);
      setSubmissions(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading submissions:', error);
      setError('Failed to load submissions.');
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentView('submissions');
    loadSubmissions(project.projectid);
  };

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

  const handleEditSubmission = (submission) => {
    setEditingSubmission(submission.id);
    setEditSubmissionFilename(submission.filename);
    setEditSubmissionCode(submission.code || '');
  };

  const handleUpdateSubmission = async (submissionId) => {
    if (!editSubmissionFilename.trim() || !user) return;

    try {
      await updateSubmission(user.uid, submissionId, {
        filename: editSubmissionFilename,
        code: editSubmissionCode,
      });
      setEditingSubmission(null);
      setEditSubmissionFilename('');
      setEditSubmissionCode('');
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error updating submission:', error);
      setError('Failed to update submission.');
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!user) return;
    try {
      await deleteSubmission(user.uid, submissionId);
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error deleting submission:', error);
      setError('Failed to delete submission.');
    }
  };

  const handleCancelSubmissionEdit = () => {
    setEditingSubmission(null);
    setEditSubmissionFilename('');
    setEditSubmissionCode('');
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGithubSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err) {
      // Common error to surface clearly when account exists with different provider
      setError(err.message || 'GitHub sign-in failed');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <SidebarProvider defaultOpen={false} name={'primary_sidebar'}>
        <NavigationBar isSignedIn={isSignUp} />
        <AppSidebar handleSignOut={handleSignOut} />
        <main className="w-screen">
          <AppHeader />
          <DashboardPage
            user={user}
            handleSignOut={handleSignOut}
            selectedProject={selectedProject}
            handleSelectProject={handleSelectProject}
            currentView={currentView}
            setCurrentView={setCurrentView}
            projects={projects}
            editingProject={editingProject}
            handleEditProject={handleEditProject}
            editProjectName={editProjectName}
            setEditProjectName={setEditProjectName}
            editProjectDesc={editProjectDesc}
            setEditProjectDesc={setEditProjectDesc}
            handleUpdateProject={handleUpdateProject}
            handleCancelProjectEdit={handleCancelProjectEdit}
            handleDeleteProject={handleDeleteProject}
            newSubmissionFilename={newSubmissionFilename}
            setNewSubmissionFilename={setNewSubmissionFilename}
            newSubmissionCode={newSubmissionCode}
            setNewSubmissionCode={setNewSubmissionCode}
            newSecurityRev={newSecurityRev}
            setNewSecurityRev={setNewSecurityRev}
            newLogicRev={newLogicRev}
            setNewLogicRev={setNewLogicRev}
            newTestCases={newTestCases}
            setNewTestCases={setNewTestCases}
            newReviewPdf={newReviewPdf}
            setNewReviewPdf={setNewReviewPdf}
            handleCreateSubmissionWithFields={handleCreateSubmissionWithFields}
            submissions={submissions}
            editingSubmission={editingSubmission}
            handleEditSubmission={handleEditSubmission}
            editSubmissionFilename={editSubmissionFilename}
            setEditSubmissionFilename={setEditSubmissionFilename}
            editSubmissionCode={editSubmissionCode}
            setEditSubmissionCode={setEditSubmissionCode}
            handleUpdateSubmission={handleUpdateSubmission}
            handleCancelSubmissionEdit={handleCancelSubmissionEdit}
            handleDeleteSubmission={handleDeleteSubmission}
          />
        </main>
      </SidebarProvider>
    );
  }

  return isSignUp ? <LoginPage /> : <SignupPage />;

}

export default App;
