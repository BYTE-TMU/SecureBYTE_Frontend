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
import { createSubmission } from '@/api';
import { useAuth } from '@/hooks/auth/AuthContext';
import { toast } from 'sonner';

export default function CreateNewProjectDialog({ open, onOpenChange }) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { createNewProject } = useProject();
  const { user } = useAuth();

  const parseFileContent = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      try {
        reader.readAsText(file);
      } catch (err) {
        reject(err);
      }
    });
  };

  const prepareForAnalysis = async () => {
    if (!user) {
      toast.error('Please log in to create a project');
      return;
    }

    if (!newProjectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      setUploading(true);
      console.log('Files to upload', files);

      // Step 1: Create a new project
      const newProject = await createNewProject({
        newProjectName,
        newProjectDesc,
      });
      const projectId = newProject.projectid; // Backend returns 'projectid', not 'id'
      console.log('Project created with ID:', projectId);

      // Step 2: Upload all files as submissions
      if (files.length > 0) {
        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
          try {
            const fileContent = await parseFileContent(file);
            await createSubmission(user.uid, projectId, {
              filename: file.name,
              code: fileContent || '',
              logicrev: [],
              testcases: [],
            });
            successCount++;
            console.log(`Uploaded file: ${file.name}`);
          } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err);
            failCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Project created with ${successCount} file(s)`);
        }
        if (failCount > 0) {
          toast.warning(`${failCount} file(s) failed to upload`);
        }
      } else {
        toast.success('Project created successfully');
      }

      // Close dialog and reset form
      if (onOpenChange) onOpenChange(false);
      setNewProjectName('');
      setNewProjectDesc('');
      setFiles([]);
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      toast.error(`Failed to create project: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    // TODO: If success, create a new project + open the code editor with a new project
    // TODO: If failed, display error toast

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">
            Upload as a New Project
          </DialogTitle>
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
        <FileUploadInput files={files} setFiles={setFiles} />
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
