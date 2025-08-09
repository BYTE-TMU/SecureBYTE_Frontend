import { createProject } from '@/api';
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
import { useAuth } from '@/hooks/auth/AuthContext';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

export function NewProjectDialog() {
  const { user } = useAuth();

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [error, setError] = useState('');

  const createNewProject = async () => {
    //TODO: in hte future, add an error
    if (!newProjectName.trim() || !user) return;

    try {
      console.log('Creating project for user:', user.uid); // Debug log
      console.log('Project data:', {
        project_name: newProjectName,
        project_desc: newProjectDesc,
      }); // Debug log

      const response = await createProject(user.uid, {
        project_name: newProjectName,
        project_desc: newProjectDesc || '',
        fileids: [],
      });
      console.log(response);
      setNewProjectName('');
      setNewProjectDesc('');

      //TODO: add in a page refresh here too
      setError('');
    } catch (err) {
      console.error('Error creating project:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to create new project: ${
          err.response?.data?.error || err.message
        }`,
      );
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
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="project-desc">Username</Label>
              <Input
                id="project-desc"
                name="project-desc"
                placeholder="Project description (optional)"
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
              <Button type="submit" onClick={createNewProject}>
                Save changes
                {/* //TODO: add in success and error toasts */}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
