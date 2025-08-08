import React, { useState } from 'react';
import { columns } from '../custom-components/individual-project-table/columns';
import IndividualProjectTable from '../custom-components/individual-project-table/IndividualProjectTable';
import { getSubmissions } from '@/api';

export default function IndividualProjectPage() {
  const mockData = [
    {
      submissionDate: 'Today',
      submissionType: 'TESTING',
    },
    {
      submissionDate: 'Today',
      submissionType: 'TESTING',
    },
    {
      submissionDate: 'Today',
      submissionType: 'TESTING',
    },
    {
      submissionDate: 'Today',
      submissionType: 'TESTING',
    },
  ];
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState([]);

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
  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <h1 className="font-bold text-4xl text-secure-blue">Project</h1>
      <IndividualProjectTable columns={columns} data={mockData} />
    </div>
  );
}
