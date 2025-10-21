import { useState } from 'react';
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
import { toast } from 'sonner';

export function RenameFolderDialog({ currentPath, onRename }) {
  const [newName, setNewName] = useState(currentPath || '');

  const handleRename = (e) => {
    e?.preventDefault();
    if (!newName || !newName.trim()) {
      toast.error('Invalid folder name');
      return;
    }

    onRename && onRename(currentPath, newName.trim());
    toast.success('Folder renamed');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 w-full text-left">
          Rename Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>
            Enter the new path or name for the folder. Use slashes for nested
            paths.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 mt-2">
          <div className="grid gap-3">
            <Label htmlFor="folder-rename">New Folder Name</Label>
            <Input
              id="folder-rename"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleRename}>Rename</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RenameFolderDialog;
