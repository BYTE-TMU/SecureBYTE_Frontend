import { columns } from '../custom-components/individual-project-table/columns';
import IndividualProjectTable from '../custom-components/individual-project-table/IndividualProjectTable';
import { useParams, useLocation, useNavigate } from 'react-router';
import { useGetSubmissions } from '@/hooks/useGetSubmissions';
import { toast } from 'sonner';
import { useProject } from '../../hooks/project/ProjectContext';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { listGithubRepos, linkGithubRepo, importGithubRepo } from '@/api';
import React, { useState, useEffect } from 'react';
import { useGetFileStructure } from '@/hooks/useGetFileStructure';
import ResizableCodeEditor from '../custom-components/code-editor/ResizableCodeEditor';
import GenerateSecurityReviewSheet from '../custom-components/GenerateSecurityReviewSheet';
import LoadingPage from './LoadingPage';

export default function IndividualProjectPage() {
  let { projectId } = useParams();
  const { fetchProjectById } = useProject();
  const { user } = useAuth();
  const {
    tree,
    loading: treeLoading,
    refetch: refetchFileTree,
  } = useGetFileStructure(projectId);
  const {
    submissions,
    error: submissionsError,
    loading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetSubmissions(projectId);

  const [securityReview, setSecurityReview] = useState('');
  const location = useLocation();
  const projectName = location.state?.projectName;
  const [isSecReviewLoading, setIsSecReviewLoading] = useState(false);

  console.log(tree);
  //github repo dialog
  const [isRepoDialogOpen, setIsRepoDialogOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [branch, setBranch] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    if (!projectId) {
      console.log('Missing projectId');
      return;
    }

    async function fetchData() {
      console.log(projectId);
      try {
        const projectData = await fetchProjectById({ projectId });
        console.log(
          `Printing project data from IndividualProjectPage: ${projectData}`,
        );
        // setProjectName(projectData['project_name']);
      } catch (err) {
        console.error(
          `Failed to load project: ${err.response?.data?.error || err.message}`,
        );
      }
    }

    fetchData();
  }, [projectId]);

  console.log(
    `[PROJECT PAGE] Current submissions count: ${submissions?.length || 0}`,
    submissions,
  );

  const hasGithubToken = useMemo(() => {
    return Boolean(localStorage.getItem('github_access_token'));
  }, []);

  // Show loading page while data is being fetched
  if (submissionsLoading || treeLoading) {
    return <LoadingPage />;
  }

  // Log submissions info after loading is complete
  console.log(`inside indiv project: ${projectId}`);
  console.log(submissions?.map((submission) => submission.filename));

  const openRepoDialog = async () => {
    if (!user) return;
    setRepoError('');
    setIsRepoDialogOpen(true);
    try {
      setLoadingRepos(true);
      const resp = await listGithubRepos(user.uid);
      console.log(resp.data);
      setRepos(resp.data || []);
    } catch (err) {
      setRepoError(err.response?.data?.error || err.message);
      setRepos([]);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleRepoChange = (value) => {
    setSelectedRepo(value);
    const found = repos.find((r) => r.full_name === value);
    setBranch('');
  };

  const handleLinkRepo = async () => {
    if (!user || !projectId || !selectedRepo) return;
    setRepoError('');
    try {
      setIsWorking(true);
      console.log('[FRONTEND] Linking repo:', selectedRepo);
      await linkGithubRepo(user.uid, projectId, {
        repo_full_name: selectedRepo,
        branch,
      });
      // After linking, immediately import to populate files
      console.log('[FRONTEND] Starting import after link');
      const resp = await importGithubRepo(user.uid, projectId, {
        repo_full_name: selectedRepo,
        branch,
        max_files: 5000,
        max_bytes: 5242880,
      });
      console.log('[FRONTEND] Import response:', resp.data);
      setIsRepoDialogOpen(false);
      const count = resp?.data?.files_imported;
      toast.success(
        `Repository linked and files imported${typeof count === 'number' ? ` (${count} files)` : ''}`,
      );
      console.log('[FRONTEND] Refetching submissions');
      await refetchSubmissions();
      console.log('[FRONTEND] Link+import complete');
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      console.error('[FRONTEND] Link/import failed:', err);
      setRepoError(msg);
      toast.error(`Failed: ${msg}`);
    } finally {
      setIsWorking(false);
    }
  };

  const handleImportRepo = async () => {
    if (!user || !projectId) return;
    setRepoError('');
    try {
      setIsWorking(true);
      console.log(
        '[FRONTEND] Importing files from repo:',
        selectedRepo || 'linked repo',
      );
      const resp = await importGithubRepo(user.uid, projectId, {
        repo_full_name: selectedRepo || undefined,
        branch: branch || undefined,
        max_files: 5000,
        max_bytes: 5242880,
      });
      console.log('[FRONTEND] Import response:', resp.data);
      setIsRepoDialogOpen(false);
      const count = resp?.data?.files_imported;
      toast.success(
        `Files imported from GitHub${typeof count === 'number' ? ` (${count} files)` : ''}`,
      );
      console.log('[FRONTEND] Refetching submissions');
      await refetchSubmissions();
      console.log('[FRONTEND] Import complete');
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      console.error('[FRONTEND] Import failed:', err);
      setRepoError(msg);
      toast.error(`Failed: ${msg}`);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h1 className="font-bold text-4xl text-secure-blue">{`Project: ${projectName}`}</h1>
      <div className="my-3 flex gap-2">
        {hasGithubToken && (
          <Button onClick={openRepoDialog} className="bg-secure-orange">
            Link GitHub Repository
          </Button>
        )}
        <GenerateSecurityReviewSheet
          submissions={submissions}
          projectId={projectId}
          setSecurityReview={setSecurityReview}
          projectName={projectName}
          setIsSecReviewLoading={setIsSecReviewLoading}
        />
      </div>
      {submissionsError ? (
        <div className="text-destructive text-sm mt-2">{submissionsError}</div>
      ) : null}
      <Dialog open={isRepoDialogOpen} onOpenChange={setIsRepoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link your GitHub Repository</DialogTitle>
            <DialogDescription>
              Select a repository and optionally a branch to link or import
              files.
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
                {/* Branch optional; backend will use repo default if omitted */}
                {repoError ? (
                  <div className="text-destructive text-sm">{repoError}</div>
                ) : null}
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

      <ResizableCodeEditor
        tree={tree}
        refetchFileTree={refetchFileTree}
        securityReview={securityReview}
        openFiles={openFiles}
        setOpenFiles={setOpenFiles}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        isSecReviewLoading={isSecReviewLoading}
      />
      <IndividualProjectTable columns={columns} data={submissions} />
    </main>
  );
}
