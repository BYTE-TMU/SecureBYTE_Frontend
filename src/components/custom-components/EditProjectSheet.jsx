import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { updateProject } from '@/api';

export default function EditProjectSheet({ project }) {
  const { user } = useAuth();
  const [error, setError] = useState('');

  const [editedProjectName, setEditedProjectName] = useState('');
  const [editedProjectDesc, setEditedProjectDesc] = useState('');

  const handleEditProject = (project) => {
    setEditedProjectName(project.project_name);
    setEditedProjectDesc(project.project_desc || '');
  };

  useEffect(() => {
    handleEditProject(project);
  }, [user]);

  const editProject = async () => {
    //TODO: in hte future, add an error
    if (!editedProjectName.trim() || !user) return;

    try {
      const response = await updateProject(user.uid, project.projectid, {
        project_name: editedProjectName,
        project_desc: editedProjectDesc,
      });
      console.log(response);
      setEditedProjectName('');
      setEditedProjectDesc('');

      //TODO: add in a page refresh here too
      setError('');
    } catch (error) {
      console.error('Error editing project:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to edit a project: ${
          error.response?.data?.error || error.message
        }`,
      );
    }
  };
  return (
    <Sheet>
      <SheetTrigger className=" p-2 w-full text-left font-normal justify-start text-sm hover:bg-secondary hover:rounded-md hover:cursor-pointer ">
        Edit Project
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{project.project_name}</SheetTitle>
          <SheetDescription>
            Edit your project's name or description.
          </SheetDescription>
        </SheetHeader>
        <form className="p-5 flex flex-col gap-5" onSubmit={editProject}>
          <div className="flex flex-col gap-2">
            <Label>Project Name</Label>
            <Input
              defaultValue={editedProjectName}
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 mb-110">
            <Label>Project Description</Label>
            <Input
              defaultValue={editedProjectDesc}
              value={editedProjectDesc}
              onChange={(e) => setEditedProjectDesc(e.target.value)}
            />
          </div>
          <SheetFooter className=" p-0">
            <Button type="submit" className="hover:cursor-pointer">
              Save Changes
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full hover:cursor-pointer">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
