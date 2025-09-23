import { useState } from 'react';
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

import { useParams } from 'react-router';
import { ContextMenuLabel } from '@radix-ui/react-context-menu';

export default function FileTree({ tree, onFileSelectFromFileTree }) {
  const { projectId } = useParams();

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

function Folder({ folder, index, onFileSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible key={index} defaultOpen={false} className="group/collapsible">
      <SidebarMenuItem>
        <ContextMenu>
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
            <div>
              <ContextMenuTrigger>
                <SidebarMenuButton>
                  {isOpen ? (
                    <ChevronDown className="stroke-secure-orange" />
                  ) : (
                    <ChevronRight className="stroke-secure-orange" />
                  )}
                  <FolderCode className="size-3" />

                  {folder.name}
                </SidebarMenuButton>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Rename Folder</ContextMenuItem>
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

  return (
    <SidebarMenuItem
      key={index}
      onClick={() => onFileSelect(file)}
      className="roudned-lg"
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
