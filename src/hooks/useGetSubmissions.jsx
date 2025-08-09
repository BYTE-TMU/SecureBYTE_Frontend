import { useAuth } from '@/hooks/auth/AuthContext';
import { useEffect, useState } from 'react';
import { getSubmissions } from '@/api';

export function useGetSubmissions(projectId) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !projectId) return;
    const fetchSubmissions = async () => {
      try {
        const response = await getSubmissions(user.uid, projectId);
        setSubmissions(response.data);
        setError('');
      } catch (err) {
        setError(
          `Failed to load submissions: ${
            err.response?.data?.error || err.message
          }`,
        );
        setSubmissions([]);
      }
    };

    fetchSubmissions();
  }, [user]);

  return { submissions, error };
}
