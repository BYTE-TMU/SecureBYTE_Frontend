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
  ChevronDown,
  ChevronRight,
  FileCode,
  FilePlus,
  FolderCode,
  FolderPlus,
  ShieldCheck,
} from 'lucide-react';

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

import { DeleteSubmissionAlert } from '../DeleteSubmissionAlert';

import RenameSubmissionDialog from './file-tree/RenameSubmissionDialog';
import { NewSubmissionDialog } from '../NewSubmissionDialog';
import { useParams } from 'react-router';

  
 import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DeleteSubmissionAlert } from '../DeleteSubmissionAlert';

export default function FileTree({ tree, onFileSelectFromFileTree }) {
  const { projectId } = useParams();
  console.log('Printing file tree', tree);

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
                console.log('key: ', key, 'value: ', value),
              )}
              {Object.entries(tree).map(([key, value]) =>
                value.type === 'folder' ? (
                  <Folder
                    folder={value}
                    index={key}
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
        <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
          <ContextMenu>
            <ContextMenuTrigger>
              <SidebarMenuButton>
                {isOpen ? (
                  <ChevronDown className="stroke-secure-orange" />
                ) : (
                  <ChevronRight className="stroke-secure-orange" />
                )}
                <FolderCode className="size-3" />

                {folder.name}
                {/* <FileTreeContextMenu variant={'folder'} name={folder.name} /> */}
              </SidebarMenuButton>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Edit Name</ContextMenuItem>
              <ContextMenuItem>Billing</ContextMenuItem>
              <ContextMenuItem>Team</ContextMenuItem>
              <ContextMenuItem>Subscription</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </CollapsibleTrigger>
        {Object.entries(folder.children).map(([key, value]) => (
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

    <SidebarMenuItem key={index} className="flex">
      <div className="relative w-full">
        <SidebarMenuButton 
          onContextMenu={handleContextMenu}
          onClick={() => onFileSelect(file)}
          key={index}
        >
          <FileCode />
          {file.name}
        </SidebarMenuButton>
        
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className="absolute inset-0 opacity-0 pointer-events-none"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DeleteSubmissionAlert submission={file} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
    </SidebarMenuItem>
  );
}
