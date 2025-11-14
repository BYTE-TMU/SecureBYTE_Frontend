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

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate(); 

  // Support form state
const [openSupport, setOpenSupport] = useState(false);
const [formData, setFormData] = useState({
  name: '',
  type: '',
  description: '',
});

// Handle input changes with basic sanitization
const handleChange = (e) => {
  const { name, value } = e.target;
  const cleanValue = value.replace(/<\/?[^>]+(>|$)/g, ''); // remove HTML tags
  setFormData({ ...formData, [name]: cleanValue });
};

// Handle form submission
const handleSubmit = (e) => {
  e.preventDefault();

  // For now, just log and alert
  console.log('Support form submitted:', formData);
  alert('Support request submitted!');

  setOpenSupport(false);
  setFormData({ name: '', type: '', description: '' });
};

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
            <SidebarMenuButton onClick={() => setOpenSupport(true)}>
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

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
      {openSupport && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-4 rounded w-80">
          <h2 className="text-lg font-bold mb-2">Support Form</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="type"
              placeholder="Support Type (Bug, Feature, Question)"
              value={formData.type}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Describe your issue..."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded p-1"
            />
            <div className="flex justify-end mt-2 gap-2">
              <Button type="button" onClick={() => setOpenSupport(false)}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </div>
    )}
    </Sidebar>
  );
}
