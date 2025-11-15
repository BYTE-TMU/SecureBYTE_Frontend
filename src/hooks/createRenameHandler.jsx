import { toast } from 'sonner';
import { moveSubmission } from '@/api';
// Helper function to collect all folder names from tree and persisted folders (excluding current folder)
const collectAllFolderNames = (node, persistedFolders, currentFolderPath) => {
  const names = [];

  // Get folder names from tree
  const traverse = (n) => {
    if (!n || !n.children) return;

    Object.values(n.children).forEach((child) => {
      if (child.type === 'folder') {
        const folderPath = child.path || child.name;
        if (folderPath !== currentFolderPath) {
          names.push(child.name);
        }
        traverse(child);
      }
    });
  };

  traverse(node);

  // Also get folder names from persisted folders
  Object.keys(persistedFolders).forEach((path) => {
    if (path !== currentFolderPath) {
      const folderName = path.split('/').pop();
      if (!names.includes(folderName)) {
        names.push(folderName);
      }
    }
  });

  return names;
};

// Add this helper function at the top level of your FileTree component, before the Folder component

export const createRenameHandler = ({
  type, // 'file' or 'folder'
  currentItem,
  renameValue,
  isRenamingRef,
  setRenaming,
  setRenameValue,
  user,
  projectId,
  parentFolder,
  fullTree,
  persistedFolders,
  persistFolders,
  renameFolderInProject,
  refetchSubmissions,
  onFileRenamed,
  queueFolderOperation,
}) => {
  return async () => {
    // Don't proceed if not actually renaming anymore
    if (!isRenamingRef.current) return;

    const currentName =
      type === 'file'
        ? currentItem.name
        : (currentItem.path || currentItem.name).split('/').pop();

    // Early return if no change or empty
    if (!renameValue.trim() || renameValue === currentName) {
      setRenaming(false);
      setRenameValue(currentName);
      return;
    }

    if (type === 'file') {
      // Validate: Check if another file with this name exists in the same folder
      if (parentFolder && parentFolder.children) {
        const filesInSameFolder = Object.values(parentFolder.children).filter(
          (child) => child.type === 'file' && child.id !== currentItem.id,
        );
        const duplicateFile = filesInSameFolder.find(
          (f) => f.name === renameValue,
        );
        if (duplicateFile) {
          toast.error('A file with this name already exists in this folder');
          setRenaming(false);
          setRenameValue(currentName);
          return;
        }
      }

      try {
        // Preserve folder path when renaming
        const filePath = currentItem.path || currentItem.name;
        const pathParts = filePath.split('/');

        // Replace just the filename (last part) with the new name
        pathParts[pathParts.length - 1] = renameValue;
        const newPath = pathParts.join('/');

        // Update filename via backend API
        await moveSubmission(user.uid, currentItem.id, newPath);

        // Notify parent component to update open tabs
        if (onFileRenamed) {
          onFileRenamed(currentItem, renameValue, newPath);
        }

        toast.success('File renamed');
        setRenaming(false);

        // Refetch file tree to update UI
        if (refetchSubmissions) {
          await refetchSubmissions();
        }
      } catch (err) {
        console.error('Failed to rename file', err);
        toast.error('Failed to rename file');
        setRenameValue(currentName);
        setRenaming(false);
      }
    } else if (type === 'folder') {
      console.log('📁 Renaming folder...');
      const currentPath = currentItem.path || currentItem.name;
      const pathParts = currentPath.split('/');
      const parentPath = pathParts.slice(0, -1).join('/');
      const newPath = parentPath ? `${parentPath}/${renameValue}` : renameValue;

      console.log('📁 Folder paths:', currentPath, '→', newPath);

      // Validation stays the same...
      if (!renameValue.trim()) {
        toast.error('Folder name cannot be empty');
        setRenaming(false);
        setRenameValue(currentName);
        return;
      }

      const ancestorNames = currentPath.split('/').slice(0, -1);
      if (ancestorNames.includes(renameValue)) {
        toast.error('Cannot rename to an ancestor folder name');
        setRenaming(false);
        setRenameValue(currentName);
        return;
      }

      const allFolderNames = collectAllFolderNames(
        fullTree,
        persistedFolders,
        currentPath,
      );
      if (allFolderNames.includes(renameValue)) {
        toast.error('A folder with this name already exists in this project');
        setRenaming(false);
        setRenameValue(currentName);
        return;
      }

      try {
        // STEP 1: Update localStorage IMMEDIATELY (for instant UI feedback)
        console.log('💾 Updating localStorage immediately...');
        const raw = localStorage.getItem(
          `secureBYTE_custom_folders_${projectId}`,
        );
        const persisted = raw ? JSON.parse(raw) : {};
        const updatedFolders = {};

        // Remove old folder paths
        Object.keys(persisted).forEach((path) => {
          if (path === currentPath || path.startsWith(currentPath + '/')) {
            console.log('🗑️ Removing old folder path:', path);
            return;
          }
          updatedFolders[path] = persisted[path];
        });

        // Add new folder path
        updatedFolders[newPath] = { path: newPath };
        console.log('➕ Added new folder path:', newPath);

        // Add child folders with updated paths
        Object.keys(persisted).forEach((path) => {
          if (path.startsWith(currentPath + '/')) {
            const childSuffix = path.substring(currentPath.length);
            const newChildPath = newPath + childSuffix;
            updatedFolders[newChildPath] = {
              ...persisted[path],
              path: newChildPath,
            };
            console.log('➕ Added child folder:', path, '→', newChildPath);
          }
        });

        // Update localStorage immediately for instant UI update
        persistFolders(updatedFolders);
        console.log('✅ localStorage updated immediately');

        // STEP 2: Queue the backend sync (non-blocking)
        if (queueFolderOperation) {
          console.log('📋 Queueing folder rename for backend sync...');
          queueFolderOperation({
            type: 'rename',
            oldPath: currentPath,
            newPath: newPath,
          });
        } else {
          // Fallback: if queue not available, call directly
          console.warn(
            '⚠️ queueFolderOperation not available, calling directly',
          );
          await renameFolderInProject({
            projectId,
            oldPath: currentPath,
            newPath: newPath,
          });
        }

        // STEP 3: Handle file moves (still synchronous for now)
        if (user && refetchSubmissions) {
          const filesToMove = [];
          const findFilesInFolder = (node, currentFolderPath) => {
            if (!node || !node.children) return;
            Object.entries(node.children).forEach(([key, value]) => {
              if (value.type === 'file') {
                const filePath =
                  value.path || `${currentFolderPath}/${value.name}`;
                filesToMove.push({
                  id: value.id,
                  oldPath: filePath,
                  fileName: value.name,
                });
              } else if (value.type === 'folder') {
                const folderSubPath =
                  value.path || `${currentFolderPath}/${value.name}`;
                findFilesInFolder(value, folderSubPath);
              }
            });
          };

          findFilesInFolder(currentItem, currentPath);

          if (filesToMove.length > 0) {
            console.log(
              `🔄 Moving ${filesToMove.length} file(s) after folder rename...`,
            );
            for (const file of filesToMove) {
              let relativePath;
              if (file.oldPath.startsWith(currentPath + '/')) {
                relativePath = file.oldPath.substring(currentPath.length + 1);
              } else {
                relativePath = file.fileName;
              }
              const newFilePath = `${newPath}/${relativePath}`;

              try {
                await moveSubmission(user.uid, file.id, newFilePath);
                console.log(`✅ File moved: ${file.oldPath} → ${newFilePath}`);
                await new Promise((resolve) => setTimeout(resolve, 100));
              } catch (err) {
                console.error(
                  `❌ Failed to move file ${file.oldPath} to ${newFilePath}`,
                  err,
                );
              }
            }
          }

          // Refetch to get updated file list
          await refetchSubmissions();
        }

        setRenaming(false);
        toast.success('Folder renamed');
        console.log('✅ Folder rename complete');
      } catch (err) {
        console.error('❌ Rename failed', err);
        toast.error('Failed to rename folder');
        setRenaming(false);
        setRenameValue(currentName);
      }
    }
  };
};
