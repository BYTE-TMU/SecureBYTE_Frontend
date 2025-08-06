import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import blackLogo from '../../assets/black-logo.svg';
import { CirclePlus, History, LayoutDashboard, LogOut } from 'lucide-react';
import UploadFileDialog from './UploadFileDialog';

export default function AppSidebar({ handleSignOut }) {
  return (
    <Sidebar
      className="border-secure-blue pt-16"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={'Dashboard'}>
                <SidebarMenuButton asChild>
                  <a href={'/dashboard'}>
                    <LayoutDashboard className="stroke-primary" />
                    <span className="text-primary">Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={'Upload Files'}>
                <UploadFileDialog />
              </SidebarMenuItem>
              <SidebarMenuItem key={'Upload History'}>
                <SidebarMenuButton asChild>
                  <a href={'/upload-history'}>
                    <History className="stroke-black" />
                    <span className="text-primary">Upload History</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              <span onClick={handleSignOut}>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
