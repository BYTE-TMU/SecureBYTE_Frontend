import React from 'react';
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
import { CirclePlus, Upload } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FileUploadInput } from './FileUploadInput';

export default function SubmissionDialog() {
  return (
    //TODO: add in a functionality to uplaod files to existing, project or new project first
    //TODO: add in context functions where if the dialog is passed a context variable, then it adds to the project, else you get to pick project
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton
          asChild
          className="bg-secure-orange duration-500 ease-in-out hover:bg-secure-blue hover:dark:text-white hover:cursor-pointer"
        >
          <div>
            <CirclePlus className="stroke-white" />
            <span className="text-white">Upload Files</span>
          </div>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">Upload Your Code</DialogTitle>
          <DialogDescription>
            Paste your code or upload your file to receive AI-powered feedback.
          </DialogDescription>
        </DialogHeader>
        {/* <Input type="file" /> */}
        <FileUploadInput />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="bg-secure-orange">
            Prepare For Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
