import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  getProjects,
  createProject,
  deleteProject,
  getProjectById,
} from '@/api';

const ProjectContext = createContext();

export function ProjectProvider({ children, autoFetch = false }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [singleProject, setSingleProject] = useState('');
  const [projectFiles, setProjectFiles] = useState({});

  useEffect(() => {
    if (user && autoFetch) {
      fetchProjects();
    }
  }, [user, autoFetch]);

  const fetchProjects = async () => {
    console.log('Fetching projects...');

    try {
      setLoading(true);
      const response = await getProjects(user.uid);
      setProjects(response.data);
      setFetchError('');
    } catch (err) {
      setFetchError(
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
      const response = await getProjectById(user.uid, projectId);
      setSingleProject(response.data);
      setFetchError('');
    } catch (err) {
      console.error(
        `Failed to load project: ${err.response?.data?.error || err.message}`,
      );
      throw new Error(`Failed to load project with id ${projectId}`);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async ({ newProjectName, newProjectDesc }) => {
    //TODO: in the future, add an error
    console.log('Create a new project from Provider');
    if (!newProjectName.trim() || !user) return;

    try {
      setLoading(true);

      const response = await createProject(user.uid, {
        project_name: newProjectName,
        project_desc: newProjectDesc || '',
        fileIds: [],
      });

      // Success case: Refresh projects lists
      await fetchProjects();
      setLoading(false);

      return response;
    } catch (err) {
      setLoading(false);
      throw new Error(
        `Failed to create a new project: ${
          err.response?.data?.error || err.message
        }`,
      );
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
      throw new Error(
        `Failed to delete project ${project.projectid}: ${
          err.response?.data?.error || err.message
        }`,
      );
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
        failed
      };

    } catch (err) {
      throw new Error(
        `Bulk delete project fail: ${err.response?.data?.error || err.message}`,
      );
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

  const getFilesFromProject = (projectId) => {
    return projectFiles[projectId] || [];
  };

  return (
    <ProjectContext.Provider
      value={{
        user,
        loading,
        projects,
        fetchProjects,
        fetchProjectById,
        fetchError,
        getFilesFromProject,
        setFilesForProject,
        createNewProject,
        deleteOneProject,
        deleteProjectInBulk,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
