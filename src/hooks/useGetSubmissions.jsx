import { useAuth } from '@/hooks/auth/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSubmissions } from '@/api';

export function useGetSubmissions(projectId) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const lastFetchedRef = useRef(0);
  const isFetchingRef = useRef(false);

  const refetch = useCallback(async () => {
    if (!user || !projectId) {
      console.log('[SUBMISSIONS] No user or projectId for refetch');
      return;
    }
    if (isFetchingRef.current) {
      console.log('[SUBMISSIONS] Skip refetch; already loading');
      return;
    }
    const now = Date.now();
    if (now - lastFetchedRef.current < 1500) {
      console.log('[SUBMISSIONS] Throttled refetch within 1.5s');
      return;
    }
    console.log(`[SUBMISSIONS] Fetching submissions for project ${projectId}`);
    try {
      isFetchingRef.current = true;
      setLoading(true);
      const response = await getSubmissions(user.uid, projectId);
      console.log('[SUBMISSIONS] Raw submissions response:', response);
      const arr = Array.isArray(response) ? response : [];
      console.log(`[SUBMISSIONS] Got ${arr.length} submissions`);
      setSubmissions(arr);
      setError('');
      lastFetchedRef.current = Date.now();
    } catch (err) {
      console.error('[SUBMISSIONS] Failed to fetch submissions:', err);
      const tooMany = err?.response?.status === 429;
      // With standardized responses, unwrapResponse extracts the error message
      const errorMessage = err.message || 'Unknown error occurred';
      const msg = tooMany ? 'Too many requests. Please wait and try again.' : errorMessage;
      setError(`Failed to load submissions: ${msg}`);
      setSubmissions([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user, projectId]);

  const initialFetchRef = useRef(false);
  useEffect(() => {
    if (!user || !projectId) return;
    const key = `${user.uid}:${projectId}`;
    if (initialFetchRef.current === key) return;
    initialFetchRef.current = key;
    refetch();
  }, [user, projectId, refetch]);

  return { submissions, error, loading, refetch };
}
