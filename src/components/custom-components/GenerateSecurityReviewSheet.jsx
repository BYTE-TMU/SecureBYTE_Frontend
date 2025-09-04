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

export default function GenerateSecurityReviewSheet({ submissions, projectId }) {
  const { fetchProjectById, singleProject } = useProject(); 
  const { user } = useAuth(); 
  const [projectFiles, setProjectFiles] = useState([]); 
  const [securityReview, setSecurityReview] = useState(null); 
  const [error, setError] = useState(''); 
  const [projectName, setProjectName] = useState(''); 

  useEffect(() => {
    setProjectFiles(submissions.map((submission) => submission.filename)); 

  }, [submissions])

  const handleGenerateReview = async () => {
    console.log("Start generating review"); 

    // Call to the backend
    try {
      const response = await getSecurityReview(user.uid, projectId); 
      // setSecurityReview(response.data); 
      setError(''); 
      console.log(response.data); // Debug log

    } catch (err) {
      setError(err.response?.data?.error || err.message); 
      console.error(
          `Failed to generate security review: ${err.response?.data?.error || err.message}`,
      );
    }
    // Display review to users 
  }

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3">
        Generate Security Review
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Security Review for [LATER: project_name]</SheetTitle>
          <SheetDescription>Receive AI-generated security review for this project</SheetDescription>
        </SheetHeader>
        <div className='px-5 h-[70%]'>
          <p className='font-bold'>The AI model will run a security review on the following files: </p>
          <div className='p-2 h-[90%] overflow-y-scroll border-2'>
            <ul className='list-disc pl-5'>
              {projectFiles.map((filename, index) => (
                <li key={index}>{filename}</li>
              ))}
            </ul>
          </div>
        </div>
        <SheetFooter>
           <Button className="hover:cursor-pointer" onClick={handleGenerateReview}>
              Generate Review
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full hover:cursor-pointer">
                Cancel
              </Button>
            </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

}