import { useAuth } from '@/hooks/auth/AuthContext';
import { useEffect, useState } from 'react';
import { getProjects } from '@/api';

export function useGetAllProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const response = await getProjects(user.uid);
        setProjects(response.data);
        setError('');
      } catch (err) {
        setError(
          `Failed to load projects: ${
            err.response?.data?.error || err.message
          }`,
        );
        setProjects([]);
      }
    };

    fetchProjects();
  }, [user]);

  return { projects, error };
}
