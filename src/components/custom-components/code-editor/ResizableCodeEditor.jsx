import { useEffect, useRef, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../ui/resizable';
import FileTree from './FileTree';
import { FileTabBar, FileTabContent } from '../../ui/file-tab';
import ReviewModal from '../ai-review-panel/ReviewModal';
import { useUpdateFiles } from '@/hooks/useUpdateFiles';
import { updateSubmission } from '@/api';
import { useAuth } from '@/hooks/auth/AuthContext';
import { toast } from 'sonner';

export default function ResizableCodeEditor({
  tree,
  refetchSubmissions,
  securityReview,
  openFiles,
  setOpenFiles,
  activeFile,
  setActiveFile,
  projectId,
  isSecReviewLoading,
}) {
  const { trackFileUpdate } = useUpdateFiles();
  const { user } = useAuth();

  // Track unsaved files (files with unsaved changes)
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());

  // Track pending save operations for retry
  const pendingSavesRef = useRef(new Map());

  useEffect(() => {
    if (activeFile) {
      console.log('Active file updated:', activeFile);
    }
  }, [activeFile]);

  // Handle file rename to update open tabs
  const handleFileRenamed = (oldFile, newName, newPath) => {
    setOpenFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === oldFile.id
          ? { ...file, name: newName, path: newPath }
          : file,
      ),
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

    console.log('Currently active file', activeFile);
  };

  // Reorder tabs via drag and drop
  const reorderTabs = (dragIndex, dropIndex) => {
    const newFiles = [...openFiles];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    setOpenFiles(newFiles);
  };

  // Helper function to save to backend with retry logic
  const saveToBackendWithRetry = async (
    fileId,
    fileName,
    filePath,
    content,
    retryCount = 0,
  ) => {
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds

    try {
      await updateSubmission(user.uid, fileId, {
        code: content,
        filename: filePath,
      });

      // Success! Remove from unsaved files
      setUnsavedFiles((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });

      // Remove from pending saves
      pendingSavesRef.current.delete(fileId);

      console.log('✅ File saved to backend:', fileName);
      return { success: true };
    } catch (err) {
      const isRateLimited = err.response?.status === 429;
      const shouldRetry = retryCount < maxRetries;

      if (isRateLimited && shouldRetry) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = baseDelay * Math.pow(2, retryCount);

        console.log(
          `⏳ Rate limited. Retrying in ${delay / 1000}s... (attempt ${retryCount + 1}/${maxRetries})`,
        );

        // Wait and retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        return saveToBackendWithRetry(
          fileId,
          fileName,
          filePath,
          content,
          retryCount + 1,
        );
      } else {
        // Final failure - give up
        console.error('❌ Failed to save to backend after retries:', err);

        return {
          success: false,
          isRateLimited,
          error: err.message,
        };
      }
    }
  };

  // Update file content in memory and sessionStorage only
  const updateFileContent = async ({ targetFile, newContent }) => {
    // Check if the file is currently open
    const existingFile = openFiles.find((file) => file.id === targetFile.id);

    if (existingFile) {
      // Mark file as unsaved (has changes)
      setUnsavedFiles((prev) => new Set(prev).add(targetFile.id));

      // Update activeFile content
      setActiveFile({ ...targetFile, content: newContent });
      setOpenFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === targetFile.id ? { ...file, content: newContent } : file,
        ),
      );

      // Save to sessionStorage only (not backend - wait for manual save)
      trackFileUpdate({
        fileId: targetFile.id,
        fileName: targetFile.name,
        code: newContent,
      });
    }

    console.log("Active file's content is updated:", targetFile.content);
    console.log('CURRENTLY OPEN FILES', openFiles);
  };

  // Manual save all files to backend
  const handleSaveAllFiles = async () => {
    if (!user) return;

    const filesToSave = Array.from(unsavedFiles);
    if (filesToSave.length === 0) {
      toast.info('No unsaved changes');
      return;
    }

    toast.info(`Saving ${filesToSave.length} file(s)...`);

    let successCount = 0;
    let failCount = 0;
    let rateLimitedCount = 0;

    for (const fileId of filesToSave) {
      const file = openFiles.find((f) => f.id === fileId);
      if (!file) continue;

      const result = await saveToBackendWithRetry(
        file.id,
        file.name,
        file.path || file.name,
        file.content,
        0,
      );

      if (result.success) {
        successCount++;
      } else {
        failCount++;
        if (result.isRateLimited) {
          rateLimitedCount++;
        }
      }
    }

    // Show appropriate toast based on results
    if (successCount > 0 && failCount === 0) {
      toast.success(`Successfully saved ${successCount} file(s)`);
    } else if (successCount > 0 && failCount > 0) {
      toast.warning(`Saved ${successCount} file(s), but ${failCount} failed`);
    } else if (failCount > 0) {
      if (rateLimitedCount > 0) {
        toast.error(
          `Failed to save ${failCount} file(s) - server is busy. Please try again in a moment.`,
        );
      } else {
        toast.error(`Failed to save ${failCount} file(s)`);
      }
    }
  };

  return (
    <div className="max-w-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="border rounded-lg min-w-0 w-full"
      >
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={20}
          className="min-w-0 overflow-x-hidden overflow-y-auto"
        >
          <div className="w-full overflow-x-auto">
            <FileTree
              tree={tree}
              refetchSubmissions={refetchSubmissions}
              onFileSelectFromFileTree={openNewFile}
              onFileRenamed={handleFileRenamed}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={50}
          maxSize={60}
          className="min-h-0 max-w-140 "
        >
          <div className="h-screen">
            <FileTabBar
              openFiles={openFiles}
              activeFile={activeFile}
              onOpenFile={openNewFile}
              onCloseFile={closeFile}
              onSwitchTab={switchTab}
              onReorderTabs={reorderTabs}
              unsavedFiles={unsavedFiles}
              onSaveAll={handleSaveAllFiles}
            />
            <FileTabContent
              activeFile={activeFile}
              isDarkTheme={false}
              onEditorChange={updateFileContent}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={20}
          className="min-w-0 overflow-x-hidden overflow-y-auto"
        >
          <ReviewModal
            activeFile={activeFile}
            securityReview={securityReview}
            projectId={projectId}
            isSecReviewLoading={isSecReviewLoading}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
