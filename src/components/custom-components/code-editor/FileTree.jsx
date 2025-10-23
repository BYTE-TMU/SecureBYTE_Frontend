import { useState, useRef, useEffect } from 'react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '../../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FolderCode,
  FolderPlus,
} from 'lucide-react';


import RenameSubmissionDialog from './file-tree/RenameSubmissionDialog';
import { toast } from 'sonner';
import { useProject } from '@/hooks/project/ProjectContext';
import { useAuth } from '@/hooks/auth/AuthContext';
import { moveSubmission } from '@/api';
import { NewSubmissionDialog } from '../NewSubmissionDialog';
import NewFolderDialog from '@/components/custom-components/NewFolderDialog';
import { DeleteSubmissionAlert } from '../DeleteSubmissionAlert';

import { useParams } from 'react-router';
import { ContextMenuLabel } from '@radix-ui/react-context-menu';

export default function FileTree({ tree, onFileSelectFromFileTree, refetchFileTree }) {
  const { projectId } = useParams();
  const { createFolderInProject, renameFolderInProject } = useProject();
  const { user } = useAuth();
  const [treeKey, setTreeKey] = useState(0); // For forcing re-render

  const [persistedFolders, setPersistedFolders] = useState(() => {
    try {
      const raw = sessionStorage.getItem(`secureBYTE_custom_folders_${projectId}`);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Error loading persisted folders', err);
      return {};
    }
  });

  // Helper to update persistedFolders state and sessionStorage
  const persistFolders = (next) => {
    try {
      sessionStorage.setItem(`secureBYTE_custom_folders_${projectId}`, JSON.stringify(next));
      setPersistedFolders(next);
      setTreeKey(prev => prev + 1); // Force re-render without page reload
    } catch (err) {
      console.error('Error persisting folders', err);
    }
  };

  // Merge persisted folders into the server-derived tree so UI shows them
  const mergedTree = { ...tree };
  Object.entries(persistedFolders || {}).forEach(([path, folderNode]) => {
    const parts = path.split('/');
    let current = mergedTree;
    let currentPath = '';
    
    parts.forEach((part, idx) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (idx === parts.length - 1) {
        // Last part - the actual folder we're creating
        if (!current[part]) {
          current[part] = { 
            type: 'folder', 
            name: part, 
            path: currentPath,
            children: {} 
          };
        } else {
          // Update path if folder already exists
          current[part].path = currentPath;
        }
      } else {
        // Intermediate folder in the path
        if (!current[part]) {
          current[part] = { 
            type: 'folder', 
            name: part, 
            path: currentPath,
            children: {} 
          };
        } else if (!current[part].children) {
          // Ensure children object exists
          current[part].children = {};
        }
        current = current[part].children;
      }
    });
  });

  return (
    <div className="flex flex-col text-sm">
      {' '}
      <SidebarHeader className="flex flex-row items-center justify-between bg-secondary">
        <h2 className="font-medium">Project Name</h2>
        <div className="flex flex-row items-center gap-2">
          {/* <FilePlus className="size-4" /> */}
          <NewSubmissionDialog variant={'icon'} projectId={projectId} />
          <NewFolderDialog
            variant="icon"
            onCreate={async (folderName) => {
              try {
                await createFolderInProject({ projectId, folderPath: folderName });
                const next = { ...persistedFolders, [folderName]: { path: folderName } };
                persistFolders(next);
                toast.success('Folder created');
              } catch (err) {
                console.error('Error creating folder', err);
                toast.error('Failed to create folder');
              }
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="h-2/3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(mergedTree).map(([key, value]) =>
                value.type === 'folder' ? (
                  <Folder
                    folder={value}
                    key={key}
                    onFileSelect={onFileSelectFromFileTree}
                    projectId={projectId}
                    renameFolderInProject={renameFolderInProject}
                    persistFolders={persistFolders}
                    persistedFolders={persistedFolders}
                    user={user}
                    refetchFileTree={refetchFileTree}
                    fullTree={mergedTree}
                  />
                ) : (
                  <File
                    file={value}
                    index={key}
                    onFileSelect={onFileSelectFromFileTree}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
}

function Folder({ folder, index, onFileSelect, projectId, renameFolderInProject, persistFolders, persistedFolders, user, refetchFileTree, fullTree }) {
  const [isOpen, setIsOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.path || folder.name);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('type', 'folder');
    e.dataTransfer.setData('path', folder.path || folder.name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const draggedType = e.dataTransfer.getData('type');
    const draggedPath = e.dataTransfer.getData('path');
    const targetFolderPath = folder.path || folder.name;

    // Prevent dropping into itself
    if (draggedPath === targetFolderPath) return;
    if (draggedPath.startsWith(targetFolderPath + '/')) return;

    try {
      if (draggedType === 'folder') {
        // Move folder into this folder
        const pathParts = draggedPath.split('/');
        const folderName = pathParts[pathParts.length - 1];
        const newPath = `${targetFolderPath}/${folderName}`;
        
        await renameFolderInProject({ projectId, oldPath: draggedPath, newPath });
        
        // Update sessionStorage - remove old path and add new path, plus update all child folders
        const raw = sessionStorage.getItem(`secureBYTE_custom_folders_${projectId}`);
        const persisted = raw ? JSON.parse(raw) : {};
        
        // Find and update all folders that start with the dragged path
        const updatedFolders = {};
        Object.keys(persisted).forEach((path) => {
          if (path === draggedPath) {
            // This is the folder being moved
            updatedFolders[newPath] = { ...persisted[path], path: newPath };
          } else if (path.startsWith(draggedPath + '/')) {
            // This is a child folder - update its path too
            const childSuffix = path.substring(draggedPath.length);
            const newChildPath = newPath + childSuffix;
            updatedFolders[newChildPath] = { ...persisted[path], path: newChildPath };
          } else {
            // Keep other folders as-is
            updatedFolders[path] = persisted[path];
          }
        });
        
        persistFolders(updatedFolders);
        
        // Find and move all files within this folder and its subfolders
        const filesToMove = [];
        const findFilesInFolder = (node, currentPath) => {
          if (!node || !node.children) return;
          Object.entries(node.children).forEach(([key, value]) => {
            if (value.type === 'file') {
              const filePath = value.path || `${currentPath}/${value.name}`;
              filesToMove.push({
                id: value.id,
                oldPath: filePath,
                fileName: value.name
              });
            } else if (value.type === 'folder') {
              const folderPath = value.path || `${currentPath}/${value.name}`;
              findFilesInFolder(value, folderPath);
            }
          });
        };
        
        // Find the dragged folder in the tree
        const findFolderNode = (tree, targetPath) => {
          const parts = targetPath.split('/');
          let current = tree;
          for (const part of parts) {
            if (current[part]) {
              if (current[part].type === 'folder') {
                if (current[part].path === targetPath) {
                  return current[part];
                }
                current = current[part].children || {};
              }
            }
          }
          return null;
        };
        
        const draggedFolderNode = findFolderNode(fullTree || {}, draggedPath);
        if (draggedFolderNode) {
          findFilesInFolder(draggedFolderNode, draggedPath);
        }
        
        // Update all file paths in the backend
        if (user && filesToMove.length > 0) {
          await Promise.all(
            filesToMove.map(async (file) => {
              // Calculate the relative path from the dragged folder
              let relativePath;
              if (file.oldPath.startsWith(draggedPath + '/')) {
                // File is nested in the folder
                relativePath = file.oldPath.substring(draggedPath.length + 1);
              } else if (file.oldPath === `${draggedPath}/${file.fileName}`) {
                // File is directly in the folder
                relativePath = file.fileName;
              } else {
                // Fallback - just use the filename
                relativePath = file.fileName;
              }
              const newFilePath = `${newPath}/${relativePath}`;
              
              try {
                await moveSubmission(user.uid, file.id, newFilePath);
              } catch (err) {
                console.error(`Failed to move file ${file.oldPath} to ${newFilePath}`, err);
              }
            })
          );
        }
        
        toast.success(`Folder moved${filesToMove.length > 0 ? ` with ${filesToMove.length} file(s)` : ''}`);
        
        // Refetch file tree to update UI
        if (refetchFileTree) {
          await refetchFileTree();
        }
      } else if (draggedType === 'file') {
        // Move file into this folder - need to update submission filename
        const fileId = e.dataTransfer.getData('fileId');
        const fileName = draggedPath.split('/').pop();
        const newPath = `${targetFolderPath}/${fileName}`;
        
        if (user && fileId) {
          await moveSubmission(user.uid, fileId, newPath);
          toast.success('File moved');
          
          // Refetch file tree to update UI
          if (refetchFileTree) {
            await refetchFileTree();
          }
        } else {
          toast.error('Unable to move file - missing user or file ID');
        }
      }
    } catch (err) {
      console.error('Drop failed', err);
      toast.error('Failed to move item');
    }
  };

  return (
    <Collapsible key={index} defaultOpen={false} className="group/collapsible">
      <SidebarMenuItem>
        <ContextMenu>
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
            <div
              draggable
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={isDragOver ? 'bg-blue-100 dark:bg-blue-900' : ''}
            >
              <ContextMenuTrigger>
                <SidebarMenuButton className="overflow-hidden">
                  {isOpen ? (
                      <ChevronDown className="stroke-secure-orange flex-shrink-0" />
                    ) : (
                      <ChevronRight className="stroke-secure-orange flex-shrink-0" />
                    )}
                    <FolderCode className="size-3 flex-shrink-0" />

                    {renaming ? (
                      <input
                        ref={inputRef}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            try {
                            await renameFolderInProject({ projectId, oldPath: folder.path || folder.name, newPath: renameValue });
                              // update session storage view
                            const raw = sessionStorage.getItem(`secureBYTE_custom_folders_${projectId}`);
                            const persisted = raw ? JSON.parse(raw) : {};
                            if (persisted[folder.path]) {
                              const v = persisted[folder.path];
                              delete persisted[folder.path];
                              persisted[renameValue] = { ...v, path: renameValue };
                            } else {
                              persisted[renameValue] = { path: renameValue };
                            }
                            persistFolders(persisted);
                              setRenaming(false);
                              toast.success('Folder renamed');
                            } catch (err) {
                              console.error('Rename failed', err);
                              toast.error('Failed to rename folder');
                            }
                          } else if (e.key === 'Escape') {
                            setRenaming(false);
                            setRenameValue(folder.path || folder.name);
                          }
                        }}
                        onBlur={() => {
                          setRenaming(false);
                          setRenameValue(folder.path || folder.name);
                        }}
                        className="bg-transparent border-b border-gray-400 text-sm mx-2"
                      />
                    ) : (
                      <span className="truncate">{folder.name}</span>
                    )}
                </SidebarMenuButton>
              </ContextMenuTrigger>
              <ContextMenuContent className="min-w-[200px]">
                <ContextMenuItem>
                  <button
                    onClick={() => {
                      setRenaming(true);
                    }}
                    className="w-full text-left"
                  >
                    Rename Folder
                  </button>
                </ContextMenuItem>
              </ContextMenuContent>
            </div>
          </CollapsibleTrigger>
        </ContextMenu>
        {isOpen &&
          Object.entries(folder.children).map(([key, value]) => (
            <CollapsibleContent key={key}>
              <SidebarMenuSub>
                {value.type === 'folder' ? (
                  <Folder
                    folder={value}
                    index={key}
                    onFileSelect={onFileSelect}
                    projectId={projectId}
                    renameFolderInProject={renameFolderInProject}
                    persistFolders={persistFolders}
                    persistedFolders={persistedFolders}
                    user={user}
                    refetchFileTree={refetchFileTree}
                    fullTree={fullTree}
                  />
                ) : (
                  <File file={value} index={key} onFileSelect={onFileSelect} />
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          ))}
      </SidebarMenuItem>
    </Collapsible>
  );
}

function File({ file, index, onFileSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle right-click on file component
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuOpen(true);
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('type', 'file');
    e.dataTransfer.setData('path', file.path || file.name);
    e.dataTransfer.setData('fileId', file.id);
  };

  return (
    <SidebarMenuItem
      key={index}
      onClick={() => onFileSelect(file)}
      className="roudned-lg"
      draggable
      onDragStart={handleDragStart}
    >
      <ContextMenu>
        <ContextMenuTrigger className="flex gap-2 items-center">
          <SidebarMenuButton>
            <FileCode className="size-4" />
            {file.name}
          </SidebarMenuButton>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <DeleteSubmissionAlert submission={file} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </SidebarMenuItem>
  );
}
