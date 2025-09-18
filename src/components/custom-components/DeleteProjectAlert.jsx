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
import { useProject } from '@/hooks/project/ProjectContext';
import { useState } from 'react';

export function DeleteProjectAlert({ project, closeDropdown }) {
  const [error, setError] = useState('');
  const { deleteOneProject } = useProject();

  const handleDeleteProject = async () => {
    // Close the dropdown menu of the project - whether the project is deleted successfully or not
    closeDropdown();

    try {
      await deleteOneProject({ project });
      setError('');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(
        `Failed to delete project: ${err.response?.data?.error || err.message}`,
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
