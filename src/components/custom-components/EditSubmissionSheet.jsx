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
import { updateSubmission } from '@/api';

export default function EditSubmissionSheet({ submission }) {
  const { user } = useAuth();
  const [error, setError] = useState('');

  const [newSubmissionFilename, setNewSubmissionFilename] = useState('');
  const [newSubmissionCode, setNewSubmissionCode] = useState('');
  const [newSecurityRev, setNewSecurityRev] = useState('');
  const [newLogicRev, setNewLogicRev] = useState('');
  const [newTestCases, setNewTestCases] = useState('');
  const [newReviewPdf, setNewReviewPdf] = useState('');

  const [editedSubmissionFilename, setEditedSubmissionFilename] = useState('');
  const [editedSubmissionCode, setEditedSubmissionCode] = useState('');

  const handleEditSubmission = (submission) => {
    setEditedSubmissionFilename(submission.filename);
    setEditedSubmissionCode(submission.code || '');
  };

  useEffect(() => {
    handleEditSubmission(submission);
  }, [user]);

  const editSubmission = async () => {
    if (!editedSubmissionFilename.trim() || !user) return;

    try {
      await updateSubmission(user.uid, submission.id, {
        filename: editedSubmissionFilename,
        code: editedSubmissionCode,
      });
      setEditSubmissionFilename('');
      setEditSubmissionCode('');
      setError('');
    } catch (error) {
      console.error('Error editing submission:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to edit a submission: ${
          error.response?.data?.error || error.message
        }`,
      );
    }
  };

  return (
    <Sheet>
      <SheetTrigger className=" p-2 w-full text-left font-normal justify-start text-sm hover:bg-secondary hover:rounded-md hover:cursor-pointer ">
        Edit Submission
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{submission.filename}</SheetTitle>
          <SheetDescription>
            Edit your submission file's name or the code.
          </SheetDescription>
        </SheetHeader>
        <form className="p-5 flex flex-col gap-5" onSubmit={editSubmission}>
          <div className="flex flex-col gap-2">
            <Label>File Name</Label>
            <Input
              value={editedSubmissionFilename}
              onChange={(e) => setEditedSubmissionFilename(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 mb-110">
            <Label>File Code</Label>
            <Input
              value={editedSubmissionCode}
              onChange={(e) => setEditedSubmissionCode(e.target.value)}
            />
          </div>
          <SheetFooter className=" p-0">
            <Button type="submit" className="hover:cursor-pointer">
              Save Changes
            </Button>
            <SheetClose>
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
