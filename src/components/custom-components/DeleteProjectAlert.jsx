import { deleteProject } from '@/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useState } from 'react';

export function DeleteProjectAlert({ project }) {
  const { user } = useAuth();
  const [error, setError] = useState('');

  const handleDeleteProject = async () => {
    if (!user || !project.projectid) return;
    try {
      await deleteProject(user.uid, project.projectid);
      //TODO: add in succes/error toast
      setError('');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError(
        `Failed to delete a project: ${
          error.response?.data?.error || error.message
        }`,
      );
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className=" p-2 w-full text-left font-normal justify-start text-sm hover:bg-secondary hover:rounded-sm hover:cursor-pointer text-destructive "
        >
          Delete Project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            project and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteProject}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
