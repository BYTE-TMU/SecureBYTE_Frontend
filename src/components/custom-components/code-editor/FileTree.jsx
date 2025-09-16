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
  return (
    <SidebarMenuItem key={index} onClick={() => onFileSelect(file)}>
      <SidebarMenuButton>
        <ContextMenu>
          <ContextMenuTrigger className="w-full flex items-center gap-2">
            <FileCode className="size-4" />
            {file.name}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>New File</ContextMenuItem>
            <ContextMenuItem>New Folder</ContextMenuItem>
            <ContextMenuItem>
              <RenameSubmissionDialog
                submission={file}
              ></RenameSubmissionDialog>
            </ContextMenuItem>
            <ContextMenuItem>
              <DeleteSubmissionAlert submission={file}></DeleteSubmissionAlert>
            </ContextMenuItem>
            <ContextMenuItem>Subscription</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
