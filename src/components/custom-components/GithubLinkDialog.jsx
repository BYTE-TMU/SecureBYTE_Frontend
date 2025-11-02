import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function GithubLinkDialog({
  isOpen,
  onOpenChange,
  repos,
  setRepos,
  selectedRepo,
  setSelectedRepo,
  branch,
  setBranch,
  loadingRepos,
  repoError,
  isWorking,
  handleLinkRepo,
  handleImportRepo,
}) {
  const handleRepoChange = (value) => {
    setSelectedRepo(value);
    const found = repos.find((r) => r.full_name === value);
    setBranch(found?.default_branch || '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link your GitHub Repository</DialogTitle>
          <DialogDescription>
            Select a repository and optionally a branch to link or import files.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {loadingRepos ? (
            <div>Loading repositories...</div>
          ) : (
            <>
              <label className="text-sm">Repository</label>
              <select
                className="border rounded-md p-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={selectedRepo}
                onChange={(e) => handleRepoChange(e.target.value)}
              >
                <option value="">Select repo</option>
                {repos.map((r) => (
                  <option key={r.id} value={r.full_name}>
                    {r.full_name}
                  </option>
                ))}
              </select>
              {repoError && (
                <div className="text-destructive text-sm">{repoError}</div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleLinkRepo}
            disabled={!selectedRepo || isWorking}
          >
            {isWorking ? 'Working...' : 'Link'}
          </Button>
          <Button
            onClick={handleImportRepo}
            disabled={isWorking}
            variant="secondary"
          >
            {isWorking ? 'Working...' : 'Import Files'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
