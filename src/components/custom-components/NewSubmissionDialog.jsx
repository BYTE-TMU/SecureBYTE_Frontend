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
import { useState, useEffect } from 'react';
import { FileUploadInput } from './FileUploadInput';
import { toast } from 'sonner';

export function NewSubmissionDialog({ projectId, variant, refetchSubmissions,}) {
  const { user } = useAuth();
  const { setFilesForProject } = useProject();
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [availableFolders, setAvailableFolders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load available folders from sessionStorage whenever dialog opens
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = sessionStorage.getItem(`secureBYTE_custom_folders_${projectId}`);
        const persisted = raw ? JSON.parse(raw) : {};
        const folderPaths = Object.keys(persisted);
        setAvailableFolders(['', ...folderPaths]); // '' means root
      } catch (err) {
        console.error('Error loading folders', err);
      }
    }
  }, [isOpen, projectId]);

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
      // wait for ALL uploads to finish
      await Promise.all(
        files.map(async (file) => {
          console.log('About to create a submission', file.name);
          const fileContent = await parseFileContent(file);
          console.log('fileContent', fileContent);
          
          // Prepend folder path to filename if a folder is selected
          const finalFilename = selectedFolder 
            ? `${selectedFolder}/${file.name}` 
            : file.name;
          
          await createSubmission(user.uid, projectId, {
            filename: finalFilename,
            code: fileContent === null ? 'Nothing for now' : fileContent,
            securityrev: [],
            logicrev: [],
            testcases: [],
            reviewpdf: '',
          });
        })
      );
      
      toast.success('Uploaded file(s) successfully');

      // refresh submissions (set submissionsLoading to true)
      if (refetchSubmissions) await refetchSubmissions();  

    } catch (error) {
      //TODO: figure out how to display a toast here because no point in sharing error messages directly with users as it wont help them unless there is a specific action they can take - [JOHAN]
      console.error('Error creating project:', error);
      return toast(`Upload failed. Please try again ${error}`, {
        type: 'error',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <Label htmlFor="folder-select">Target Folder (Optional)</Label>
              <select
                id="folder-select"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Root (no folder)</option>
                {availableFolders.slice(1).map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </div>
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
