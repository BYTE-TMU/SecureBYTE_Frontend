import React, { useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
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
import Dashboard from './components/pages/Dashboard';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import AppSidebar from './components/custom-components/AppSidebar';
import NavigationBar from './components/custom-components/NavigationBar';
import AppHeader from './components/custom-components/AppHeader';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Project management state
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Project form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        'Auth state changed:',
        user ? `User logged in: ${user.uid}` : 'User logged out',
      );
      setUser(user);
      if (user) {
        // Load projects when user is authenticated
        console.log('About to load projects for user:', user.uid);
        loadProjects();
      } else {
        // Reset state when user logs out
        setProjects([]);
        setSelectedProject(null);
        setSubmissions([]);
        setCurrentView('projects');
      }
    });
    return () => unsubscribe();
  }, []);

  // Project management functions
  const loadProjects = async () => {
    if (!user) return;
    console.log('Loading projects for user:', user.uid); // Debug log
    try {
      const response = await getProjects(user.uid);
      console.log('Projects response:', response.data); // Debug log
      setProjects(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error loading projects:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to load projects: ${
          error.response?.data?.error || error.message
        }`,
      );
      setProjects([]);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !user) return;

    console.log('Creating project for user:', user.uid); // Debug log
    console.log('Project data:', {
      project_name: newProjectName,
      project_desc: newProjectDesc,
    }); // Debug log

    try {
      const response = await createProject(user.uid, {
        project_name: newProjectName,
        project_desc: newProjectDesc || '',
        fileids: [],
      });
      console.log('Project created:', response.data); // Debug log
      setNewProjectName('');
      setNewProjectDesc('');
      loadProjects();
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to create project: ${
          error.response?.data?.error || error.message
        }`,
      );
    }
  };

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

  const handleCreateSubmission = async () => {
    if (!newSubmissionFilename.trim() || !selectedProject || !user) return;

    try {
      await createSubmission(user.uid, selectedProject.projectid, {
        filename: newSubmissionFilename,
        code: newSubmissionCode || '',
        securityrev: [],
        logicrev: [],
        testcases: [],
        reviewpdf: '',
      });
      setNewSubmissionFilename('');
      setNewSubmissionCode('');
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error creating submission:', error);
      setError('Failed to create submission.');
    }
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
          <Dashboard
            user={user}
            handleSignOut={handleSignOut}
            selectedProject={selectedProject}
            handleSelectProject={handleSelectProject}
            currentView={currentView}
            setCurrentView={setCurrentView}
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            handleCreateProject={handleCreateProject}
            projects={projects}
            editingProject={editingProject}
            handleEditProject={handleEditProject}
            setNewProjectDesc={setNewProjectDesc}
            newProjectDesc={newProjectDesc}
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

  return isSignUp ? (
    <LoginPage
      handleSubmit={handleSubmit}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
      handleGoogleSignIn={handleGoogleSignIn}
      error={error}
      setIsSignUp={setIsSignUp}
      email={email}
      password={password}
    />
  ) : (
    <SignupPage
      handleSubmit={handleSubmit}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
      handleGoogleSignIn={handleGoogleSignIn}
      error={error}
      setIsSignUp={setIsSignUp}
      email={email}
      password={password}
    />
  );
}

export default App;
