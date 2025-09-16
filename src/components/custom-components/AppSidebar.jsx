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
import {
  CirclePlus,
  CodeXml,
  History,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import GlobalFileSubmissionDialog from './GlobalFileSubmissionDialog';
import { useAuth } from '@/hooks/auth/AuthContext';

export default function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate(); 

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
                <GlobalFileSubmissionDialog />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut onClick={
                async () => {
                console.log("About to log out"); 
                await logout();

                console.log("Finish log out"); 
                console.log("Navigate to login page");
                navigate("/auth/login"); 
              }
              }/>
              <span onClick={async () => {
                console.log("About to log out"); 
                await logout();

                console.log("Finish log out"); 
                console.log("Navigate to login page");
                navigate("/auth/login"); 
              }}>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
