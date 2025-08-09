import { useState } from 'react';
import ProjectsMasterTable from '../custom-components/projects-master-table/ProjectsMasterTable';
import { projectsMasterTableColumns } from '../custom-components/projects-master-table/columns';
import { FileTab } from '../ui/filetab';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useGetAllProjects } from '@/hooks/useGetAllProjects';
import OldDashboard from '../custom-components/OldDashboard';

export default function DashboardPage({
  handleSignOut,
  handleSelectProject,
  editingProject,
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
  const { projects, error } = useGetAllProjects();
  const { user } = useAuth();

  const [selectedProject, setSelectedProject] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentView, setCurrentView] = useState('projects'); // 'projects' or 'submissions'

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <h1 className="font-bold text-4xl text-secure-blue">Dashboard</h1>
      <ProjectsMasterTable
        columns={projectsMasterTableColumns}
        data={projects}
        user={user}
      />
      <OldDashboard
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
    </div>
  );
}
