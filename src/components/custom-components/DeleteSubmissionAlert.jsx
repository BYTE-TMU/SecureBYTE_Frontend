import { deleteProject, deleteSubmission } from '@/api';
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

export function DeleteSubmissionAlert({ submission }) {
  const { user } = useAuth();
  const [error, setError] = useState('');

  const handleDeleteSubmission = async () => {
    if (!user || !submission.id) return;

    try {
      await deleteSubmission(user.uid, submission.id);
      console.log(`Successfully delete submission: ${submission.id}`);
      setError('');
    } catch (error) {
      console.error('Error deleting submission:', error);

      //TODO: improve error handling by creating a toast
      setError(
        `Failed to delete a submission: ${
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
          Delete Submission
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            submission and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSubmission}
            className="bg-red-500"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
