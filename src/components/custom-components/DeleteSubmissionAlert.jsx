import { deleteSubmission } from '@/api';
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
import { useAuth } from '@/hooks/auth/AuthContext';
import { useState } from 'react';
import { ContextMenuItem } from '../ui/context-menu';

export function DeleteSubmissionAlert({ submission }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
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
    <>
      <ContextMenuItem
        className="text-destructive"
        onClick={() => setOpen(true)}
      >
        Delete Submission
      </ContextMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* <AlertDialogTrigger asChild></AlertDialogTrigger> */}
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
              className="bg-destructive"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
