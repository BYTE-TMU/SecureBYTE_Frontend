import { useState, useEffect } from 'react';
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
import { FolderPlus } from 'lucide-react';

export function NewFolderDialog({ variant = 'button', onCreate }) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = (e) => {
    e?.preventDefault();
    if (!folderName || !folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    onCreate && onCreate(folderName.trim());
    setFolderName('');
    setError('');
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {variant === 'icon' ? (
            <Button variant="ghost" size="sm" aria-label="New folder">
              <FolderPlus />
            </Button>
          ) : (
            <Button variant="outline">New Folder</Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              Provide a name for the new folder. You can create nested folders
              by including a slash in the name (e.g., <code>foo/bar</code>).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-2">
            <div className="grid gap-3">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                name="folder-name"
                type="text"
                placeholder="E.g., src/components"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleCreate}>
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default NewFolderDialog;
