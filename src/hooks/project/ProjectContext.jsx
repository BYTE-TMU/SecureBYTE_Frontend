import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  getProjects,
  createProject,
  deleteProject,
  createSubmission,
  getProject,
  saveProject,
  updateProject,
  deleteProjects,
} from '@/api';
import { toast } from 'sonner';

const ProjectContext = createContext();

export function ProjectProvider({ children, autoFetch = false }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [singleProject, setSingleProject] = useState('');
  const [projectFiles, setProjectFiles] = useState([]);

  useEffect(() => {
    if (user && autoFetch) {
      fetchProjects();
    }
  }, [user, autoFetch]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects(user.uid);
      setProjects(response.data.data);
      setFetchError('');
    } catch (err) {
      toast.error(
        `Failed to load projects: ${err.response?.data?.error || err.message}`,
      );
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectById = async ({ projectId }) => {
    try {
      setLoading(true);
      const response = await getProject(user.uid, projectId);
      console.log(response);
      setSingleProject(response.data);
      setFetchError('');
    } catch (err) {
      toast.error(
        `Failed to load project: ${err.response?.data?.error || err.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async ({ newProjectName, newProjectDesc }) => {
    console.log('Create a new project from Provider');
    if (!newProjectName.trim() || !user) return;

    try {
      setLoading(true);

      const { data } = await createProject(user.uid, {
        project_name: newProjectName,
        project_desc: newProjectDesc || '',
        fileIds: [],
      });

      // Success case: Refresh projects lists
      await fetchProjects();
      setLoading(false);

      return data;
    } catch (err) {
      toast.error(
        `Failed to create a new project: ${
          err.response?.data?.error || err.message
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteOneProject = async ({ project }) => {
    if (!user || !project.projectid) return;

    try {
      setLoading(true);

      await deleteProject(user.uid, project.projectid);
      await fetchProjects(); // Reload Dashboard to update the delete

      setLoading(false);
      return true; // Successfully delete a project
    } catch (err) {
      toast.error(
        `Failed to delete project ${project.projectid}: ${
          err.response?.data?.error || err.message
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteMultipleProjects = async ({ projectsToDelete }) => {
    try {
      console.log(projectsToDelete);
      setLoading(true);
      const { data } = await deleteProjects(user.uid, projectsToDelete);
      return data;
    } catch (error) {
      throw new Error(
        `Failed to delete projects ${error.response?.data?.error || error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };
  const deleteProjectInBulk = async ({ projectsToDelete }) => {
    try {
      setLoading(true);

      const result = await Promise.allSettled(
        projectsToDelete.map((project) =>
          deleteOneProject({ project })
            .then(() => ({ project }))
            .catch((err) => ({ project, err })),
        ),
      );

      const successful = result
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
      const failed = result
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason || { project: null, error: r.reason });

      await fetchProjects(); // Reload Dashboard to update the delete
      setLoading(false);

      return {
        successful,
        failed,
      };
    } catch (err) {
      throw new Error(
        `Bulk delete project fail: ${err.response?.data?.error || err.message}`,
      );
    } finally {
      setLoading(false);
    }
  };
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

  const createSubmissionForProject = async ({ projectId, files }) => {
    console.log('Calling createSubmissionForProject');
    try {
      await Promise.all(
        files.map(async (file) => {
          const fileContent = await parseFileContent(file);
          await createSubmission(user.uid, projectId, {
            filename: file.name,
            code: fileContent === null ? 'Nothing for now' : fileContent,
            securityRev: [],
            logicRev: [],
            testcases: [],
            reviewpdf: '',
          });
        }),
      );

      console.log('all files uploaded');
    } catch (error) {
      console.error(`Failed to create submissions: ${error}`);
      throw error;
    }
  };

  const setFilesForProject = ({ projectId, files }) => {
    console.log('Calling setFilesForProject');
    console.log(files);
    setProjectFiles((prev) => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), ...files],
    }));
  };

  const createFolderInProject2 = async ({ projectId, folderPath }) => {
    try {
      const existingFolders = singleProject.folders || [];
      if (!existingFolders.includes(folderPath)) {
        const updatedFolders = [...existingFolders, folderPath];
        await updateProject(user.uid, projectId, {
          ...singleProject,
          folders: updatedFolders,
        });

        console.log(
          `✅ Folder "${folderPath}" saved to backend in project metadata`,
        );
      }

      // Also update sessionStorage for immediate UI updates (cache)
      const raw = sessionStorage.getItem(
        `secureBYTE_custom_folders_${projectId}`,
      );
      const persisted = raw ? JSON.parse(raw) : {};
      persisted[folderPath] = { path: folderPath };
      sessionStorage.setItem(
        `secureBYTE_custom_folders_${projectId}`,
        JSON.stringify(persisted),
      );

      return { ok: true };
    } catch (err) {
      console.error('Failed to create folder:', err);

      // Check if it's a rate limit error
      if (err.response?.status === 429) {
        throw new Error(
          'Server is busy (rate limited). Please wait 5-10 minutes before creating folders. Your folder was NOT saved.',
        );
      }

      throw new Error(
        'Failed to create folder: ' + (err.message || 'Unknown error'),
      );
    }
  };

  // Create folder persisted in sessionStorage (local only)
  const createFolderInProject = async ({ projectId, folderPath }) => {
    // Store folders in the project's metadata in the backend
    // SessionStorage is only used as a cache for immediate UI updates
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      // Get current project to read existing folders
      const projectResponse = await getProject(user.uid, projectId);
      const project = projectResponse.data;

      // Get existing folders from project metadata or empty array
      const existingFolders = project.folders || [];

      // Add new folder if it doesn't exist
      if (!existingFolders.includes(folderPath)) {
        const updatedFolders = [...existingFolders, folderPath];

        // Update project with new folders array
        await updateProject(user.uid, projectId, {
          ...project,
          folders: updatedFolders,
        });

        console.log(
          `✅ Folder "${folderPath}" saved to backend in project metadata`,
        );
      }

      // Also update sessionStorage for immediate UI updates (cache)
      const raw = sessionStorage.getItem(
        `secureBYTE_custom_folders_${projectId}`,
      );
      const persisted = raw ? JSON.parse(raw) : {};
      persisted[folderPath] = { path: folderPath };
      sessionStorage.setItem(
        `secureBYTE_custom_folders_${projectId}`,
        JSON.stringify(persisted),
      );

      return { ok: true };
    } catch (err) {
      console.error('Failed to create folder:', err);

      // Check if it's a rate limit error
      if (err.response?.status === 429) {
        throw new Error(
          'Server is busy (rate limited). Please wait 5-10 minutes before creating folders. Your folder was NOT saved.',
        );
      }

      throw new Error(
        'Failed to create folder: ' + (err.message || 'Unknown error'),
      );
    }
  };

  const renameFolderInProject = async ({ projectId, oldPath, newPath }) => {
    // Update folder in project metadata on the backend
    // Also update sessionStorage for immediate UI
    try {
      // Get current project
      const projectResponse = await getProject(user.uid, projectId);
      const project = projectResponse.data;

      // Get existing folders
      const existingFolders = project.folders || [];

      // Replace old path with new path, and update any child folder paths
      const updatedFolders = existingFolders.map((folder) => {
        if (folder === oldPath) {
          return newPath;
        } else if (folder.startsWith(oldPath + '/')) {
          // Update child folders
          return folder.replace(oldPath, newPath);
        }
        return folder;
      });

      // Update project
      await updateProject(user.uid, projectId, {
        ...project,
        folders: updatedFolders,
      });

      console.log(`✅ Folder renamed in backend: ${oldPath} → ${newPath}`);

      // Also update sessionStorage
      const raw = sessionStorage.getItem(
        `secureBYTE_custom_folders_${projectId}`,
      );
      const persisted = raw ? JSON.parse(raw) : {};
      if (persisted[oldPath]) {
        const v = persisted[oldPath];
        delete persisted[oldPath];
        persisted[newPath] = { ...v, path: newPath };
      } else {
        persisted[newPath] = { path: newPath };
      }
      sessionStorage.setItem(
        `secureBYTE_custom_folders_${projectId}`,
        JSON.stringify(persisted),
      );

      return { ok: true };
    } catch (err) {
      console.error('Failed to rename folder:', err);
      throw new Error('Failed to rename folder');
    }
  };

  const getFilesFromProject = (projectId) => {
    return projectFiles[projectId] || [];
  };

  const loadFoldersFromBackend = async (projectId) => {
    // Load folders from project metadata on the backend
    // Sync them to sessionStorage for immediate use
    try {
      const projectResponse = await getProject(user.uid, projectId);
      const project = projectResponse.data;

      const folders = project.folders || [];

      if (folders.length > 0) {
        console.log(
          `📂 Loading ${folders.length} folder(s) from backend:`,
          folders,
        );

        // Convert array to object format for sessionStorage
        const foldersObj = {};
        folders.forEach((folderPath) => {
          foldersObj[folderPath] = { path: folderPath };
        });

        // Save to sessionStorage
        sessionStorage.setItem(
          `secureBYTE_custom_folders_${projectId}`,
          JSON.stringify(foldersObj),
        );

        return foldersObj;
      }

      return {};
    } catch (err) {
      console.error('Failed to load folders from backend:', err);
      return {};
    }
  };

  const saveProjectToBackend = async ({ projectId, updatedFilesArr }) => {
    setLoading(true);

    try {
      const response = await saveProject(user.uid, projectId, updatedFilesArr);
      console.log('Successfully save project to Backend: ', response.data); // Debug log
      setFetchError('');
    } catch (err) {
      console.error(
        `Failed to save project: ${err.response?.data?.error || err.message}`,
      );
      throw new Error(`Failed to save project with id ${projectId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        user,
        loading,
        projects,
        singleProject,
        fetchProjects,
        fetchProjectById,
        fetchError,
        getFilesFromProject,
        setFilesForProject,
        createNewProject,
        createFolderInProject,
        renameFolderInProject,
        loadFoldersFromBackend,
        deleteOneProject,
        deleteProjectInBulk,
        deleteMultipleProjects,
        createSubmissionForProject,
        saveProjectToBackend,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
