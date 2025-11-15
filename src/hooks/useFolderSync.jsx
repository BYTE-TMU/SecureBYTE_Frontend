import { useState, useEffect, useCallback, useRef } from 'react';
import { useProject } from '@/hooks/project/ProjectContext';
import { toast } from 'sonner';

const STORAGE_KEY = 'secureBYTE_folderOperations_queue';
const MAX_RETRIES = 3;
const RATE_LIMIT_RETRY_DELAY = 5000; // 5 seconds for rate limit
const NORMAL_RETRY_DELAY = 1000; // 1 second for other errors

export const useFolderSync = (projectId) => {
  const {
    renameFolderInProject,
    createFolderInProject,
    deleteFolderInProject,
  } = useProject();
  const [syncQueue, setSyncQueue] = useState(() => {
    try {
      const storedItem = localStorage.getItem(STORAGE_KEY);
      return storedItem ? JSON.parse(storedItem) : [];
    } catch (err) {
      console.error('Error loading folder sync queue from localStorage:', err);
      return [];
    }
  });

  const isSyncingRef = useRef(false);
  const isPausedRef = useRef(false); // Track if we're paused due to rate limiting

  // Sync queue to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncQueue));
    } catch (err) {
      console.error('Error saving folder sync queue to localStorage:', err);
    }
  }, [syncQueue]);

  // Process the sync queue
  const processSyncQueue = useCallback(async () => {
    if (
      isSyncingRef.current ||
      syncQueue.length === 0 ||
      !projectId ||
      isPausedRef.current
    ) {
      return;
    }

    isSyncingRef.current = true;

    // Process operations one at a time
    while (syncQueue.length > 0 && !isPausedRef.current) {
      const operation = syncQueue[0];

      try {
        console.log('🔄 Syncing to backend:', operation);

        switch (operation.type) {
          case 'rename':
            await renameFolderInProject({
              projectId,
              oldPath: operation.oldPath,
              newPath: operation.newPath,
            });
            break;

          case 'create':
            await createFolderInProject({
              projectId,
              folderPath: operation.folderPath,
            });
            break;

          case 'delete':
            await deleteFolderInProject({
              projectId,
              folderPath: operation.folderPath,
            });
            break;
        }

        console.log('✅ Backend sync complete:', operation);

        // Remove the successfully synced operation
        setSyncQueue((prev) => prev.slice(1));

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        console.error('❌ Backend sync failed:', operation, err);

        // Check if it's a rate limit error (429)
        if (err.response?.status === 429 || err.status === 429) {
          console.warn('⏸️ Rate limit hit (429), pausing sync queue...');
          isPausedRef.current = true;

          toast.error('Rate limit reached. Sync paused for 5 seconds...', {
            duration: 5000,
          });

          // Wait for the rate limit cooldown period
          await new Promise((resolve) =>
            setTimeout(resolve, RATE_LIMIT_RETRY_DELAY),
          );

          isPausedRef.current = false;
          console.log('▶️ Resuming sync queue...');

          // Don't remove the operation, we'll retry it
          continue; // Skip to next iteration (retry the same operation)
        }

        // Handle other errors with retry logic
        if (operation.retries && operation.retries >= MAX_RETRIES) {
          console.error(
            `Max retries (${MAX_RETRIES}) reached, removing operation:`,
            operation,
          );
          toast.error(
            `Failed to sync folder operation after ${MAX_RETRIES} attempts`,
          );

          // Remove the failed operation
          setSyncQueue((prev) => prev.slice(1));
        } else {
          // Increment retry count and move to end of queue
          console.log(
            `Retry ${(operation.retries || 0) + 1}/${MAX_RETRIES} for operation:`,
            operation,
          );
          setSyncQueue((prev) => [
            ...prev.slice(1),
            { ...operation, retries: (operation.retries || 0) + 1 },
          ]);
        }

        // Wait before processing next operation
        await new Promise((resolve) => setTimeout(resolve, NORMAL_RETRY_DELAY));
      }
    }

    isSyncingRef.current = false;
  }, [
    syncQueue,
    projectId,
    renameFolderInProject,
    createFolderInProject,
    deleteFolderInProject,
  ]);

  // Auto-process queue when it changes
  useEffect(() => {
    if (syncQueue.length > 0 && !isSyncingRef.current && !isPausedRef.current) {
      processSyncQueue();
    }
  }, [syncQueue, processSyncQueue]);

  // Queue a folder operation
  const queueFolderOperation = useCallback((operation) => {
    console.log('📋 Queueing folder operation:', operation);
    setSyncQueue((prev) => [
      ...prev,
      {
        ...operation,
        timestamp: new Date().toISOString(),
        retries: 0,
      },
    ]);
  }, []);

  // Clear all queued operations
  const clearQueue = useCallback(() => {
    setSyncQueue([]);
    localStorage.removeItem(STORAGE_KEY);
    isPausedRef.current = false;
    toast.success('Sync queue cleared');
  }, []);

  // Get pending operations count
  const getPendingCount = useCallback(() => {
    return syncQueue.length;
  }, [syncQueue]);

  // Manual resume (in case user wants to retry immediately)
  const resumeSync = useCallback(() => {
    if (isPausedRef.current) {
      isPausedRef.current = false;
      console.log('▶️ Manually resuming sync queue...');
      processSyncQueue();
    }
  }, [processSyncQueue]);

  return {
    queueFolderOperation,
    clearQueue,
    getPendingCount,
    resumeSync,
    isProcessing: isSyncingRef.current,
    isPaused: isPausedRef.current,
  };
};
