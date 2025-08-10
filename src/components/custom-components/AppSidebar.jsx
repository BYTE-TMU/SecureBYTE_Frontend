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
import {
  CirclePlus,
  CodeXml,
  History,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router';
import SubmissionDialog from './UploadFileDialog';
import { useAuth } from '@/hooks/auth/AuthContext';

export default function AppSidebar() {
  const { logout } = useAuth();
  return (
    <Sidebar
      className="border-secure-blue pt-18 "
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex gap-4">
              <SidebarMenuItem key={'Dashboard'}>
                <SidebarMenuButton asChild>
                  <a href={'/dashboard'}>
                    <LayoutDashboard className="stroke-primary" />
                    <span className="text-primary">Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={'Upload Files'}>
                <SubmissionDialog />
              </SidebarMenuItem>
              <SidebarMenuItem key={'Upload History'}>
                <SidebarMenuButton asChild>
                  <Link to={'/upload-history'}>
                    <History className="stroke-black" />
                    <span className="text-primary">Upload History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key={'Code Editor'}>
                <SidebarMenuButton asChild>
                  <Link to={'/code-editor'}>
                    <CodeXml className="stroke-black" />
                    <span className="text-primary">Code Editor</span>
                  </Link>
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
              <span onClick={logout}>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
