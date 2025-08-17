import { columns } from '../custom-components/individual-project-table/columns';
import IndividualProjectTable from '../custom-components/individual-project-table/IndividualProjectTable';
import { useParams } from 'react-router';
import { useGetSubmissions } from '@/hooks/useGetSubmissions';
import { useProject } from '../../hooks/project/ProjectContext';
import React, { useState, useEffect } from 'react';

export default function IndividualProjectPage() {
  let { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const { fetchProjectById } = useProject();

  useEffect(() => {
    if (!projectId) {
      console.log("Missing projectId"); 
      return; 
    }

    async function fetchData() {
      console.log(projectId);
      try {
        const projectData = await fetchProjectById({ projectId });
        console.log(`Printing project data: ${projectData}`) ; 
        // setProjectName(projectData['project_name']); 
      } catch (err) {
        console.error(`Failed to load project: ${err.response?.data?.error || err.message}`); 
      }

    }

    fetchData(); 
  }, [projectId]);

  const { submissions } = useGetSubmissions(projectId);

  console.log(`inside indiv project: ${projectId}`);
  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      {/* TODO: Fetch project name as title */}
      <h1 className="font-bold text-4xl text-secure-blue">{`Project: ${projectName}`}</h1>
      <IndividualProjectTable columns={columns} data={submissions} />
    </main>
  );
}
