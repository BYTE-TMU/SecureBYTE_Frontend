import ProjectsMasterTable from '../custom-components/projects-master-table/ProjectsMasterTable';
import { getProjectsMasterTableColumns } from '../custom-components/projects-master-table/columns';
import { FileTab } from '../ui/file-tab';
import { useAuth } from '@/hooks/auth/AuthContext';
import OldDashboard from '../custom-components/OldDashboard';
import { useProject } from '@/hooks/project/ProjectContext';
import React, { useState } from 'react';

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
    // resetStateUponLogOut,
  },
) {
  const { projects, fetchError } = useProject();
  const [openDropdowns, setOpenDropdowns] = useState({});
  const columns = getProjectsMasterTableColumns(
    openDropdowns,
    setOpenDropdowns,
  );

  const { user } = useAuth();

  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h1 className="font-bold text-4xl text-secure-blue">Dashboard</h1>
      <ProjectsMasterTable columns={columns} data={projects} />
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
