import { createSubmission } from '@/api';
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

export function NewSubmissionDialog({ projectId }) {
  const { user } = useAuth();
  const [error, setError] = useState('');

  const [newSubmissionFilename, setNewSubmissionFilename] = useState('');
  const [newSubmissionCode, setNewSubmissionCode] = useState('');

  const createNewSubmission = async () => {
    if (!newSubmissionFilename.trim() || !projectId || !user) return;

    try {
      await createSubmission(user.uid, projectId, {
        filename: newSubmissionFilename,
        code: newSubmissionCode || '',
        securityrev: [],
        logicrev: [],
        testcases: [],
        reviewpdf: '',
      });
      setNewSubmissionFilename('');
      setNewSubmissionCode('');
      setError('');
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to create new submission: ${
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
            New Submission
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create A New Submission</DialogTitle>
            <DialogDescription>
              Add a new submission to your project for AI-powered analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="project-name">File Name</Label>
              <Input
                id="project-name"
                name="project-name"
                type="text"
                placeholder="Project name"
                value={newSubmissionFilename}
                onChange={(e) => setNewSubmissionFilename(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="project-desc">Code</Label>
              <Input
                id="project-desc"
                name="project-desc"
                placeholder="Project description (optional)"
                value={newSubmissionCode}
                onChange={(e) => setNewSubmissionCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={createNewSubmission}>
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
