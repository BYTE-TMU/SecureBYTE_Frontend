import React, { useEffect, useState } from 'react';
import ProjectsMasterTable from '../custom-components/projects-master-table/ProjectsMasterTable';
import { projectsMasterTableColumns } from '../custom-components/projects-master-table/columns';
import { FileTab } from '../ui/filetab';
import OldDashboard from '../custom-components/OldDashboard';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/firebase';
import { getProjects } from '@/api';

export default function DashboardPage({
  // error,
  user,
  handleSignOut,
  // selectedProject,
  handleSelectProject,
  // currentView,
  // setCurrentView,
  // projects,
  newProjectName,
  setNewProjectName,
  newProjectDesc,
  setNewProjectDesc,
  editingProject,
  handleCreateProject,
  editProjectName,
  setEditProjectName,
  editProjectDesc,
  setEditProjectDesc,
  handleEditProject,
  handleUpdateProject,
  handleCancelProjectEdit,
  handleDeleteProject,
  newSubmissionFilename,
  setNewSubmissionFilename,
  newSubmissionCode,
  setNewSubmissionCode,
  newSecurityRev,
  setNewSecurityRev,
  newLogicRev,
  setNewLogicRev,
  newTestCases,
  setNewTestCases,
  newReviewPdf,
  setNewReviewPdf,
  handleCreateSubmissionWithFields,
  // submissions,
  editingSubmission,
  handleEditSubmission,
  editSubmissionFilename,
  setEditSubmissionFilename,
  editSubmissionCode,
  setEditSubmissionCode,
  handleUpdateSubmission,
  handleCancelSubmissionEdit,
  handleDeleteSubmission,
}) {
  // const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissions, setSubmissions] = useState([]);
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
        setCurrentView('projects');
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

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <h1 className="font-bold text-4xl text-secure-blue">Dashboard</h1>

      <ProjectsMasterTable
        columns={projectsMasterTableColumns}
        data={projects}
        user={user}
        loadProjects={loadProjects}
      />
      <FileTab />
      <OldDashboard
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
    </div>
  );
}
