import React, { useState, useEffect } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../ui/resizable';
import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import { FileTabBar, FileTabContent } from '../../ui/file-tab';
import ReviewModal from '../ai-review-panel/ReviewModal';
import { useUpdateFiles } from '@/hooks/useUpdateFiles';
import { updateSubmission } from '@/api';
import { useAuth } from '@/hooks/auth/AuthContext';
import { toast } from 'sonner';

export default function ResizableCodeEditor({ 
  tree,
  refetchFileTree,
  securityReview, 
  openFiles, 
  setOpenFiles, 
  activeFile, 
  setActiveFile, 
  projectId,
  isSecReviewLoading
}) {
  const { trackFileUpdate } = useUpdateFiles(); 
  const { user } = useAuth();
  
  // Track unsaved files (files with unsaved changes)
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());
  
  // Track pending save operations for retry
  const pendingSavesRef = React.useRef(new Map());

  useEffect(() => {
  if (activeFile) {
    console.log("Active file updated:", activeFile);
  }
}, [activeFile]);

  // Handle file rename to update open tabs
  const handleFileRenamed = (oldFile, newName, newPath) => {
    setOpenFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === oldFile.id
          ? { ...file, name: newName, path: newPath }
          : file
      )
    );
    
    // Update active file if it's the one being renamed
    if (activeFile && activeFile.id === oldFile.id) {
      setActiveFile({ ...activeFile, name: newName, path: newPath });
    }
  };

  const openNewFile = (targetFile) => {
    console.log('Current open files', openFiles);
    console.log('About to open a file in the FileTabBar...');
    // Check if the file is already open
    const existingFile = openFiles.find(
      (file) => file.name === targetFile.name,
    );

    // If yes, switch that file to active
    if (!existingFile) {
      setOpenFiles((prevFiles) => [...prevFiles, targetFile]); // Add the target file to the array of currently-open files
    }

    console.log(targetFile); 

    setActiveFile(targetFile);
  };

  const closeFile = (targetFileName) => {
    const existingFile = openFiles.find((file) => file.name === targetFileName);

    if (existingFile) {
      // Remove the file from the array of currently-open files
      console.log('Closing file from FileTabBar');
      setOpenFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter(
          (file) => file.name !== targetFileName,
        );

        if (activeFile && activeFile.name === targetFileName) {
          if (updatedFiles.length > 0) {
            const lastOpenedFile = updatedFiles[updatedFiles.length - 1];
            setActiveFile(lastOpenedFile);
          } else {
            setActiveFile(null);
          }
        }
        return updatedFiles;
      });
    }
  };

  const switchTab = (targetFile) => {
    console.log('Switching the tab in FileTabBar... ');
    const existingFile = openFiles.find(
      (file) => file.name === targetFile.name,
    );

    // If the file is currently open, set it to be active
    if (existingFile) {
      setActiveFile(targetFile);
    }

    console.log("Currently active file", activeFile); 
  };

  // Reorder tabs via drag and drop
  const reorderTabs = (dragIndex, dropIndex) => {
    const newFiles = [...openFiles];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    setOpenFiles(newFiles);
  };

  // Helper function to save to backend with retry logic
  const saveToBackendWithRetry = async (fileId, fileName, filePath, content, retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    
    try {
      await updateSubmission(user.uid, fileId, {
        code: content,
        filename: filePath
      });
      
      // Success! Remove from unsaved files
      setUnsavedFiles((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
      
      // Remove from pending saves
      pendingSavesRef.current.delete(fileId);
      
      console.log("✅ File saved to backend:", fileName);
      return true;
      
    } catch (err) {
      const isRateLimited = err.response?.status === 429;
      const shouldRetry = retryCount < maxRetries;
      
      if (isRateLimited && shouldRetry) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = baseDelay * Math.pow(2, retryCount);
        
        console.log(`⏳ Rate limited. Retrying in ${delay/1000}s... (attempt ${retryCount + 1}/${maxRetries})`);
        toast.warning(`Save rate limited. Retrying in ${delay/1000} seconds...`);
        
        // Schedule retry
        const timeoutId = setTimeout(() => {
          saveToBackendWithRetry(fileId, fileName, filePath, content, retryCount + 1);
        }, delay);
        
        // Store timeout ID so we can cancel if needed
        pendingSavesRef.current.set(fileId, { timeoutId, fileName });
        
        return false;
        
      } else {
        // Final failure - give up
        console.error("❌ Failed to save to backend after retries:", err);
        
        if (isRateLimited) {
          toast.error(`Unable to save "${fileName}" - server is busy. Please wait and try again later.`);
        } else {
          toast.error(`Failed to save "${fileName}" - ${err.message}`);
        }
        
        // Remove from pending saves
        pendingSavesRef.current.delete(fileId);
        
        // Keep the unsaved indicator visible
        return false;
      }
    }
  };

  // TODO: Save file content to backend when users close the file tab
  const updateFileContent = async ({ targetFile, newContent }) => {
    // Check if the file is currently open
    const existingFile = openFiles.find((file) => file.id === targetFile.id);

    if (existingFile) {
      // Cancel any pending save for this file
      const pendingSave = pendingSavesRef.current.get(targetFile.id);
      if (pendingSave) {
        clearTimeout(pendingSave.timeoutId);
        pendingSavesRef.current.delete(targetFile.id);
      }
      
      // Mark file as unsaved (has changes)
      setUnsavedFiles((prev) => new Set(prev).add(targetFile.id));
      
      // Update activeFile content
      setActiveFile({...targetFile, content: newContent}); 
      setOpenFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === targetFile.id ? { ...file, content: newContent } : file,
        ),
      );

      // Save to sessionStorage first (for immediate persistence)
      trackFileUpdate({fileId: targetFile.id, fileName: targetFile.name, code: newContent}); 
      
      // Save to backend with retry logic
      if (user) {
        await saveToBackendWithRetry(
          targetFile.id,
          targetFile.name,
          targetFile.path || targetFile.name,
          newContent
        );
      }
    }

    console.log("Active file's content is updated:", targetFile.content); 
    console.log("CURRENTLY OPEN FILES", openFiles); 
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="border rounded-lg w-full"
    >
      <ResizablePanel defaultSize={20}>
        <FileTree
          tree={tree}
          refetchFileTree={refetchFileTree}
          onFileSelectFromFileTree={openNewFile} // Callback function for selecting a file from FileTree
          onFileRenamed={handleFileRenamed} // Callback for when a file is renamed
        />{' '}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-screen">
        <FileTabBar
          openFiles={openFiles}
          activeFile={activeFile}
          onOpenFile={openNewFile}
          onCloseFile={closeFile}
          onSwitchTab={switchTab}
          onReorderTabs={reorderTabs}
          unsavedFiles={unsavedFiles}
        />
        <FileTabContent 
          activeFile={activeFile} 
          isDarkTheme={false}
          onEditorChange={updateFileContent}
        />
      </ResizablePanel>
      <ResizableHandle />
       <ResizablePanel defaultSize={25}>
        <ReviewModal 
          activeFile={activeFile} 
          securityReview={securityReview}
          projectId={projectId}
          isSecReviewLoading={isSecReviewLoading}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
