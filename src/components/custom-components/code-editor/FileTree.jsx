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
import { NewSubmissionDialog } from '../NewSubmissionDialog';
import { DeleteSubmissionAlert } from '../DeleteSubmissionAlert';
import { toast } from 'sonner';
import { moveSubmission } from '@/api';
import { useAuth } from '@/hooks/auth/AuthContext';

import { useParams } from 'react-router';
import { ContextMenuLabel } from '@radix-ui/react-context-menu';

export default function FileTree({ tree, onFileSelectFromFileTree, refetchFileTree }) {
  const { projectId } = useParams();
  const { user } = useAuth();

  return (
    <div className="flex flex-col text-sm">
      {' '}
      <SidebarHeader className="flex flex-row items-center justify-between bg-secondary">
        <h2 className="font-medium">Project Name</h2>
        <div className="flex flex-row items-center gap-2">
          {/* <FilePlus className="size-4" /> */}
          <NewSubmissionDialog variant={'icon'} projectId={projectId} />
          <FolderPlus className="size-4" />
        </div>
      </SidebarHeader>
      <SidebarContent className="h-2/3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(tree).map(([key, value]) =>
                value.type === 'folder' ? (
                  <Folder
                    folder={value}
                    key={key}
                    onFileSelect={onFileSelectFromFileTree}
                    projectId={projectId}
                    user={user}
                    refetchFileTree={refetchFileTree}
                  />
                ) : (
                  <File
                    file={value}
                    index={key}
                    onFileSelect={onFileSelectFromFileTree}
                    projectId={projectId}
                    user={user}
                    refetchFileTree={refetchFileTree}
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

function Folder({ folder, index, onFileSelect, projectId, user, refetchFileTree }) {
  const [isOpen, setIsOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.name);
  const inputRef = useRef(null);

  // Auto-focus input when renaming starts
  useEffect(() => {
    if (renaming && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [renaming]);

  const handleRename = async () => {
    if (!renameValue.trim() || renameValue === folder.name) {
      setRenaming(false);
      setRenameValue(folder.name);
      return;
    }

    try {
      const oldPath = folder.path || folder.name;
      const pathParts = oldPath.split('/');
      pathParts[pathParts.length - 1] = renameValue;
      const newPath = pathParts.join('/');

      // Find all files in this folder and update their paths
      const filesToUpdate = [];
      const findFilesInFolder = (node) => {
        if (!node || !node.children) return;
        Object.values(node.children).forEach((child) => {
          if (child.type === 'file') {
            const oldFilePath = child.path;
            const newFilePath = oldFilePath.replace(oldPath, newPath);
            filesToUpdate.push({ id: child.id, newPath: newFilePath });
          } else if (child.type === 'folder') {
            findFilesInFolder(child);
          }
        });
      };

      findFilesInFolder(folder);

      // Update all files
      if (user && filesToUpdate.length > 0) {
        await Promise.all(
          filesToUpdate.map(async (file) => {
            try {
              await moveSubmission(user.uid, file.id, file.newPath);
            } catch (err) {
              console.error(`Failed to move file ${file.id}`, err);
            }
          })
        );
      }

      toast.success(`Folder renamed${filesToUpdate.length > 0 ? ` with ${filesToUpdate.length} file(s)` : ''}`);
      setRenaming(false);

      // Refetch file tree
      if (refetchFileTree) {
        await refetchFileTree();
      }
    } catch (err) {
      console.error('Failed to rename folder', err);
      toast.error('Failed to rename folder');
      setRenameValue(folder.name);
      setRenaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    } else if (e.key === 'Escape') {
      setRenaming(false);
      setRenameValue(folder.name);
    }
  };

  return (
    <Collapsible key={index} defaultOpen={false} className="group/collapsible">
      <SidebarMenuItem>
        <ContextMenu>
          <CollapsibleTrigger asChild onClick={() => !renaming && setIsOpen(!isOpen)}>
            <div>
              <ContextMenuTrigger>
                <SidebarMenuButton className="overflow-hidden">
                  {!renaming && (isOpen ? (
                    <ChevronDown className="stroke-secure-orange flex-shrink-0" />
                  ) : (
                    <ChevronRight className="stroke-secure-orange flex-shrink-0" />
                  ))}
                  <FolderCode className="size-3 flex-shrink-0" />

                  {renaming ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent border-b border-input focus:outline-none focus:border-ring"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate">{folder.name}</span>
                  )}
                </SidebarMenuButton>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={(e) => {
                  e.preventDefault();
                  setRenaming(true);
                }}>
                  Rename Folder
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
                    user={user}
                    refetchFileTree={refetchFileTree}
                  />
                ) : (
                  <File
                    file={value}
                    index={key}
                    onFileSelect={onFileSelect}
                    projectId={projectId}
                    user={user}
                    refetchFileTree={refetchFileTree}
                  />
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          ))}
      </SidebarMenuItem>
    </Collapsible>
  );
}

function File({ file, index, onFileSelect, projectId, user, refetchFileTree }) {
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);
  const inputRef = useRef(null);
  const justStartedRenaming = useRef(false);

  // Auto-focus input when renaming starts
  useEffect(() => {
    if (renaming && inputRef.current) {
      justStartedRenaming.current = true;
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
        // Allow blur after a short delay
        setTimeout(() => {
          justStartedRenaming.current = false;
        }, 100);
      }, 0);
    }
  }, [renaming]);

  const handleRename = async () => {
    // Prevent blur from triggering immediately after opening rename
    if (justStartedRenaming.current) {
      return;
    }

    if (!renameValue.trim() || renameValue === file.name) {
      setRenaming(false);
      setRenameValue(file.name);
      return;
    }

    try {
      // Update filename via backend API
      await moveSubmission(user.uid, file.id, renameValue);
      toast.success('File renamed');
      setRenaming(false);
      
      // Refetch file tree to update UI
      if (refetchFileTree) {
        await refetchFileTree();
      }
    } catch (err) {
      console.error('Failed to rename file', err);
      toast.error('Failed to rename file');
      setRenameValue(file.name);
      setRenaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    } else if (e.key === 'Escape') {
      setRenaming(false);
      setRenameValue(file.name);
    }
  };

  return (
    <SidebarMenuItem
      key={index}
      onClick={() => !renaming && onFileSelect(file)}
      className="rounded-lg"
    >
      <ContextMenu>
        <ContextMenuTrigger className="flex gap-2 items-center">
          <SidebarMenuButton>
            <FileCode className="size-4 flex-shrink-0" />
            {renaming ? (
              <input
                ref={inputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-b border-input focus:outline-none focus:border-ring"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="truncate">{file.name}</span>
            )}
          </SidebarMenuButton>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setRenaming(true)}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem>
            <DeleteSubmissionAlert submission={file} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </SidebarMenuItem>
  );
}
