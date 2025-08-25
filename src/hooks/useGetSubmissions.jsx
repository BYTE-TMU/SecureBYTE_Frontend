import { useAuth } from '@/hooks/auth/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { getSubmissions } from '@/api';

export function useGetSubmissions(projectId) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!user || !projectId) {
      console.log('[SUBMISSIONS] No user or projectId for refetch');
      return;
    }
    console.log(`[SUBMISSIONS] Fetching submissions for project ${projectId}`);
    try {
      const response = await getSubmissions(user.uid, projectId);
      console.log(`[SUBMISSIONS] Got ${response.data?.length || 0} submissions:`, response.data);
      setSubmissions(response.data);
      setError('');
    } catch (err) {
      console.error('[SUBMISSIONS] Failed to fetch submissions:', err);
      setError(
        `Failed to load submissions: ${
          err.response?.data?.error || err.message
        }`,
      );
      setSubmissions([]);
    }
  }, [user, projectId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { submissions, error, refetch };
}
