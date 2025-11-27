import ProjectsMasterTable from '../custom-components/projects-master-table/ProjectsMasterTable';
import { getProjectsMasterTableColumns } from '../custom-components/projects-master-table/columns';
import { useProject } from '@/hooks/project/ProjectContext';
import React, { useState } from 'react';

export default function DashboardPage({}) {
  const { projects } = useProject();
  console.log(projects);
  console.log('just fetched projects');
  const [openDropdowns, setOpenDropdowns] = useState({});
  const columns = getProjectsMasterTableColumns(
    openDropdowns,
    setOpenDropdowns,
  );

  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h1 className="font-bold text-4xl text-secure-blue">Dashboard</h1>
      <ProjectsMasterTable columns={columns} data={projects} />
    </main>
  );
}
