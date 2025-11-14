import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { LayoutDashboard } from 'lucide-react';
import GlobalFileSubmissionDialog from './GlobalFileSubmissionDialog';
import NavUser from './NavUser';
import { ModeToggle } from '../ui/mode-toggle';

export default function AppSidebar() {
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
        <ModeToggle />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
