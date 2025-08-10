import { useState } from 'react';
import ProjectsMasterTable from '../custom-components/projects-master-table/ProjectsMasterTable';
import { projectsMasterTableColumns } from '../custom-components/projects-master-table/columns';
import { FileTab } from '../ui/filetab';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useGetProjects } from '@/hooks/useGetProjects';
import OldDashboard from '../custom-components/OldDashboard';

export default function DashboardPage(
  {
    // newSecurityRev,
    // setNewSecurityRev,
    // newLogicRev,
    // setNewLogicRev,
    // newTestCases,
    // setNewTestCases,
    // newReviewPdf,
    // setNewReviewPdf,
  },
) {
  const { projects, error } = useGetProjects();

  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h1 className="font-bold text-4xl text-secure-blue">Dashboard</h1>
      <ProjectsMasterTable
        columns={projectsMasterTableColumns}
        data={projects}
      />
      {/* <OldDashboard
        newSecurityRev={newSecurityRev}
        setNewSecurityRev={setNewSecurityRev}
        newLogicRev={newLogicRev}
        setNewLogicRev={setNewLogicRev}
        newTestCases={newTestCases}
        setNewTestCases={setNewTestCases}
        newReviewPdf={newReviewPdf}
        setNewReviewPdf={setNewReviewPdf}
      /> */}
    </main>
  );
}
