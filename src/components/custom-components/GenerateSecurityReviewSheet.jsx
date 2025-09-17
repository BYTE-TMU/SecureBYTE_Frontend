import React, { useEffect, useState } from 'react';
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
import { Button } from '../ui/button';
import { useProject } from '../../hooks/project/ProjectContext';
import { getSecurityReview } from '@/api';
import { useAuth } from '@/hooks/auth/AuthContext';
import { updateCurrentUser } from 'firebase/auth';
import { useUpdateFiles } from '@/hooks/useUpdateFiles';

export default function GenerateSecurityReviewSheet({
  submissions,
  projectId,
  setSecurityReview,
  projectName,
  setIsSecReviewLoading
}) {
  const { user } = useAuth();
  const [projectFiles, setProjectFiles] = useState([]);
  const [error, setError] = useState('');
  const { saveProjectToBackend } = useProject();
  const { getUpdatedFiles, clearAllUpdates } = useUpdateFiles();

  useEffect(() => {
    setProjectFiles(submissions.map((submission) => submission.filename));
  }, [submissions]);

  const handleGenerateReview = async () => {
    // STEP 1: Save current project to backend
    const updatedFiles = getUpdatedFiles();
    console.log("SECURITY REVIEW: Files sent to backend", updatedFiles);
    
    if (updatedFiles && updatedFiles.length > 0) {
      console.log('SECURITY REVIEW: Saving project to backend...');
      try {
        await saveProjectToBackend({
          projectId: projectId,
          updatedFilesArr: updatedFiles,
        });
        setError('');

        clearAllUpdates(); // Clear updates in sessionStorage
        console.log("Clear sessionStorage", sessionStorage); 
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        console.error(
          `Failed to save project to database: ${err.response?.data?.error || err.message}`,
        );
      }
    }

    // Step 2: Generate security review by calling backend
    console.log('SECURITY REVIEW: Generate review...');
    setIsSecReviewLoading(true); 

    try {
      const response = await getSecurityReview(user.uid, projectId);
      setError('');

      // Display review to users
      setSecurityReview(response.data.response);

      console.log("Before clearing sessionStorage", sessionStorage); // Debug log
      // Clear updated files in sessionStorage
      clearAllUpdates();
      console.log("After clearing sessionStorage", sessionStorage); // Debug log 
      setIsSecReviewLoading(false); 
      
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error(
        `Failed to generate security review: ${err.response?.data?.error || err.message}`,
      );
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3">
        Generate Security Review
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Security Review for {projectName} project</SheetTitle>
          <SheetDescription>
            Receive AI-generated security review for this project
          </SheetDescription>
        </SheetHeader>
        <div className="px-5 h-[70%]">
          <p className="font-bold">
            The AI model will run a security review on the following files:{' '}
          </p>
          <div className="p-2 h-[90%] overflow-y-scroll border-2">
            <ul className="list-disc pl-5">
              {projectFiles.map((filename, index) => (
                <li key={index}>{filename}</li>
              ))}
            </ul>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              className="hover:cursor-pointer"
              onClick={handleGenerateReview}
            >
              Generate Review
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" className="w-full hover:cursor-pointer">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
