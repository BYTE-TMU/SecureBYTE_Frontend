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
  useSidebar,
} from '../ui/sidebar';
import { LayoutDashboard } from 'lucide-react';
import GlobalFileSubmissionDialog from './GlobalFileSubmissionDialog';
import NavUser from './NavUser';
import { ModeToggle } from '../ui/mode-toggle';
import whiteLogo from '../../assets/white-logo.svg';

export default function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar
      className="border-secure-blue"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="bg-secure-blue items-center align-top">
        {' '}
        {open ? (
          <img src={whiteLogo} className="h-6"></img>
        ) : (
          <h1 className="font-bold text-xl text-white h-6">SB</h1>
        )}
      </SidebarHeader>
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
