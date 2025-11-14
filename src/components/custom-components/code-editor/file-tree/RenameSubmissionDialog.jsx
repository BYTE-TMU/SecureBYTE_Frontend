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
import React, { useState } from 'react';
import { FileUploadInput } from '../../FileUploadInput';
import { Button } from '@/components/ui/button';

// TODO: Incomplete - [JOHAN]
export default function RenameSubmissionDialog({ submission }) {
  const [newSubmissionName, setNewSubmissionName] = useState();
  return (
    <Dialog>
      <DialogTrigger asChild>Rename</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">Rename</DialogTitle>
          <DialogDescription>
            Rename your submission file/folder here
          </DialogDescription>
        </DialogHeader>
        {/* <Input type="file" /> */}
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="project-name">New File Name</Label>
            <Input
              id="project-name"
              name="project-name"
              type="text"
              placeholder="E.g., Hello World"
              defaultValue={submission.filename}
              value={newSubmissionName}
              onChange={(e) => setNewProjectName(e.target.value)}
            ></Input>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" variant="default">
              Prepare for Analysis
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
