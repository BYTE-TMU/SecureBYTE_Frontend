import { useAuth } from '@/hooks/auth/AuthContext';
import { useEffect, useState } from 'react';
import { getProjects } from '@/api';

export function useGetProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
  const response = await getProjects(user.uid);
  setProjects(response);
        setError('');
      } catch (err) {
        // With standardized responses, unwrapResponse extracts the error message
        const errorMessage = err.message || 'Unknown error occurred';
        const errorDetail = err.detail ? ` (${JSON.stringify(err.detail)})` : '';
        setError(`Failed to load projects: ${errorMessage}${errorDetail}`);
        setProjects([]);
      }
    };

    fetchProjects();
  }, [user]);

  return { projects, error };
}
