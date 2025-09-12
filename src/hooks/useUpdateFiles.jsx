import React, { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'secureBYTE_codeEditor_fileChanges';

export const useUpdateFiles = () => {
  const [fileUpdates, setFileUpdates] = useState(() => {
    try {
      const storedItem = sessionStorage.getItem(STORAGE_KEY);
      return storedItem ? JSON.parse(storedItem) : {};
    } catch (err) {
      console.log(
        `Error loading files that are updated so far from sessionStorage: ${err.response?.data?.error || err.message}`,
      );
      return {};
    }
  });

  // Whenever fileChanges are updated, sync it with sessionStorage
  useEffect(() => {
    try {
      console.log("useUpdateFiles: About to update sessionStorage..."); 
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fileUpdates));

      const storage = sessionStorage.getItem(STORAGE_KEY); 
      console.log("sessionStorage", storage); // Debug log
    } catch (err) {
      console.log(
        `Error saving updated files to sessionStorage: ${err.response?.data?.error || err.message}`,
      );
    }
  }, [fileUpdates]);

  // Track individual file changes
  const trackFileUpdate = useCallback(
    ({
      fileId,
      fileName,
      code,
      lastModified = new Date().toISOString(),
    }) => {
      setFileUpdates((prev) => ({
        ...prev,
        [fileId]: {
          fileId,
          fileName,
          code,
          lastModified,
        },
      }));

      console.log("From sessionStorage: CURRENT FILES BEING UPDATED: ", fileUpdates); 
    },
    [],
  );

  // Remove a file from tracking
  const removeFileTracking = useCallback((fileId) => {
    setFileUpdates((prev) => {
      const currFileChanges = { ...prev };
      delete currFileChanges[fileId];
      return currFileChanges;
    });
  }, []);

  // Clear all tracked changes
  const clearAllUpdates = useCallback(() => {
    setFileUpdates({});
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const getUpdatedFiles = useCallback(() => {
    return Object.entries(fileUpdates).map(([fileId, file]) => {
      return {
        "fileid": fileId,
        "filename": file.fileName,
        "code": file.code,
      };
    });
  }, [fileUpdates]);

  return {
    fileUpdates,
    trackFileUpdate,
    removeFileTracking,
    clearAllUpdates,
    getUpdatedFiles,
  };
};
