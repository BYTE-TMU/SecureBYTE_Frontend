import React from 'react';
import { useState } from 'react'; 
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CirclePlus, Upload } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FileUploadInput } from './FileUploadInput';
import { useProject } from '../../hooks/project/ProjectContext'; 

export default function FileSubmissionDialog() {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState(''); 
 
  const { createNewProject } = useProject(); 

  const prepareForAnalysis = async () => {
    // Create a new project 
    await createNewProject({newProjectName, newProjectDesc}); 

    // Add uploaded files to the new project

    // Redirect users to the code editor, with the new project open
  }

  return (
    // TODO: If success, create a new project + open the code editor with a new project
    // TODO: If failed, display error toast
    
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton
          asChild
          className="bg-secure-orange duration-500 ease-in-out hover:bg-secure-blue hover:dark:text-white hover:cursor-pointer"
        >
          <div>
            <CirclePlus className="stroke-white" />
            <span className="text-white">Upload Files</span>
          </div>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">Upload as a New Project</DialogTitle>
          <DialogDescription>
            Upload your code file or folder to receive AI-powered feedback
          </DialogDescription>
        </DialogHeader>
        {/* <Input type="file" /> */}
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              name="project-name"
              type="text"
              placeholder="E.g., Hello World"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            ></Input>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="project-desc">Project Description</Label>
            <Input
              id="project-desc"
              name="project-desc"
              type="text"
              placeholder="(Optional) E.g., First programming project"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
            ></Input>
          </div>
        </div>
        <FileUploadInput />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              className="bg-secure-orange"
              onClick={prepareForAnalysis}
            >
              Prepare for Analysis
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
