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
import { ChevronDown, ChevronRight, FileCode, FolderCode } from 'lucide-react';
import { Collapsible } from '../../ui/collapsible';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';

export default function FileTree() {
  const fileStructure = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'FileTree.jsx', type: 'file' },
            { name: 'ResizableCodeEditor.jsx', type: 'file' },
          ],
        },
        { name: 'App.jsx', type: 'file' },
      ],
    },
    { name: 'package.json', type: 'file' },
  ];
  return (
    <div className="flex flex-col text-sm">
      {' '}
      <SidebarHeader>
        <h2 className="font-medium">Project Name</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {fileStructure.map((item, index) =>
                item.type === 'folder' ? (
                  <Folder folder={item} key={index} />
                ) : (
                  <File file={item} key={index} />
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
        {folder.children?.map((item, index) => (
          <CollapsibleContent key={`${item.name}-${index}`}>
            <SidebarMenuSub>
              {item.type === 'folder' ? (
                <Folder folder={item} key={index} />
              ) : (
                <File file={item} key={index} />
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
