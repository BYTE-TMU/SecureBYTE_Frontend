import React from 'react';
import ProjectsMasterTable from '../custom-components/projects-master-table/ProjectsMasterTable';
import { columns } from '../custom-components/projects-master-table/columns';
import { FileTab } from '../ui/filetab';
import OldDashboard from '../custom-components/OldDashboard';

export default function Dashboard({
  error,
  user,
  handleSignOut,
  selectedProject,
  handleSelectProject,
  currentView,
  setCurrentView,
  projects,
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
  submissions,
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
  const demoData = [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
  ];
  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <h1 className="font-bold text-4xl text-secure-blue">Dashboard</h1>

      <ProjectsMasterTable columns={columns} data={projects} />
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
