import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProject } from '@/hooks/project/ProjectContext';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function NewProjectDialog() {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [error, setError] = useState('');
  const { createNewProject } = useProject(); 
  const navigate = useNavigate();

  // Use ProjectProvider to create a new project and handle errors locally.
  const handleCreateProject = async () => {
    try {
      const newProject = await createNewProject({ newProjectName, newProjectDesc}); 
      
      // Save project name before clearing form
      const savedProjectName = newProjectName;
      const projectId = newProject.data.projectid;

      // Show success message and navigate to the project page
      toast.success('Project created successfully');
      
      // Navigate to the individual project page (LoadingPage will show while data loads)
      navigate(`/projects/${projectId}`, {
        state: { projectName: savedProjectName }
      });
      
      // Note: LoadingPage.jsx would be shown in IndividualProjectPage as it blocks rendering until submissionsLoading and treeLoading are complete

    } catch(err) {
      console.error('Error creating project:', err); 
      setError(`Failed to create a new project: ${err.response?.data?.error || err.message}`); 
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <CirclePlus />
            New Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create A New Project</DialogTitle>
            <DialogDescription>
              Create a new project to your workspace to add files for AI-powered
              analysis.
            </DialogDescription>
          </DialogHeader>
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
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="project-desc">Project Description</Label>
              <Input
                id="project-desc"
                name="project-desc"
                placeholder="(Optional) E.g., First programming project"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleCreateProject}>
                Save changes
                {/* TODO: Add in success and error toasts */}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
