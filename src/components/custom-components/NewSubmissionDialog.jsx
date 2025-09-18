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
import { useProject } from '@/hooks/project/ProjectContext';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { FileUploadInput } from './FileUploadInput';
import { toast } from 'sonner';

export function NewSubmissionDialog({ projectId, variant }) {
  const { user } = useAuth();
  const { setFilesForProject } = useProject();
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);

  const parseFileContent = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        console.log('File name', file.name);
        console.log('File content', reader.result);
        resolve(reader.result);
      };

      reader.onerror = (err) => {
        console.error('Error reading file content', err);
        reject(err);
      };

      try {
        reader.readAsText(file);
      } catch (err) {
        reject(err);
      }
    });
  };

  const createNewSubmission = async () => {
    console.log(files);
    if (files.length === 0)
      return toast('Upload failed. No file selected', { type: 'error' });
    if (!projectId || !user)
      return toast(
        "Missing project or user info, please ensure you're logged in ",
        { type: 'error' },
      );

    try {
      (files.map(async (file) => {
        console.log('About to create a submission', file.name);
        const fileContent = await parseFileContent(file);
        console.log('fileContent', fileContent);
        await createSubmission(user.uid, projectId, {
          filename: file.name,
          code: fileContent === null ? 'Nothing for now' : fileContent,
          securityrev: [],
          logicrev: [],
          testcases: [],
          reviewpdf: '',
        });
      }),
        // })
        // console.log('About to create a submission', files[0].name);
        // // Parse the file content
        // const fileContent = await parseFileContent(files[0]);
        // console.log('fileContent', fileContent);

        // await createSubmission(user.uid, projectId, {
        //   filename: files[0]?.name,
        //   code: fileContent === null ? 'Nothing for now' : fileContent,
        //   securityrev: [],
        //   logicrev: [],
        //   testcases: [],
        //   reviewpdf: '',
        // });
        setError(''));
      return toast('Uploaded file(s) successfully', { type: 'success' });
    } catch (error) {
      //TODO: figure out how to display a toast here because no point in sharing error messages directly with users as it wont help them unless there is a specific action they can take - [JOHAN]
      console.error('Error creating project:', error);
      return toast(`Upload failed. Please try again ${error}`, {
        type: 'error',
      });
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to create new submission: ${
          error.response?.data?.error || error.message
        }`,
      );
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {variant === 'icon' ? (
            <Button variant="ghost">
              <CirclePlus />
            </Button>
          ) : (
            <Button variant="outline">
              <CirclePlus />
              New Submission
            </Button>
          )}
          {/* <Button variant="outline">
            <CirclePlus />
            New Submission
          </Button> */}
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
              {/* <Input
                id="project-name"
                name="project-name"
                type="text"
                placeholder="Project name"
                value={newSubmissionFilename}
                onChange={(e) => setNewSubmissionFilename(e.target.value)}
              /> */}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="project-desc">Code</Label>
              {/* <Input
                id="project-desc"
                name="project-desc"
                placeholder="Project description (optional)"
                value={newSubmissionCode}
                onChange={(e) => setNewSubmissionCode(e.target.value)}
              /> */}
            </div>
            <FileUploadInput files={files} setFiles={setFiles} />
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
