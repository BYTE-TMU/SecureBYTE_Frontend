import React, { useState } from 'react';
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
} from '@radix-ui/react-collapsible';
import { useGetFileStructure } from '@/hooks/useGetFileStructure';
import { useParams } from 'react-router';

export default function FileTree({ tree }) {
  console.log(tree);
  return (
    <div className="flex flex-col text-sm">
      {' '}
      <SidebarHeader className="flex flex-row items-center justify-between bg-secondary">
        <h2 className="font-medium">Project Name</h2>
        <div className="flex flex-row items-center gap-2">
          <FilePlus className="size-4" />
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
                  <Folder folder={value} index={key} />
                ) : (
                  <File file={value} index={key} />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
}

function Folder({ folder, index }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible key={index} defaultOpen={false} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
          <SidebarMenuButton>
            {isOpen ? (
              <ChevronDown className="stroke-secure-orange" />
            ) : (
              <ChevronRight className="stroke-secure-orange" />
            )}
            <FolderCode />
            <span className="mr-auto">{folder.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {Object.entries(folder.children).map(([key, value]) => (
          <CollapsibleContent key={key}>
            <SidebarMenuSub>
              {value.type === 'folder' ? (
                <Folder folder={value} index={key} />
              ) : (
                <File file={value} index={key} />
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        ))}
      </SidebarMenuItem>
    </Collapsible>
  );
}

function File({ file, index }) {
  return (
    <SidebarMenuItem key={index}>
      <SidebarMenuButton>
        <FileCode />
        {file.name}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
