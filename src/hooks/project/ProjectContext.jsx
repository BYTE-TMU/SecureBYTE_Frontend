import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  getProjects,
  createProject,
  deleteProject,
  getProject, 
  saveProject
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
      setProjects(response);
      setFetchError('');
    } catch (err) {
      // With standardized responses, unwrapResponse extracts the error message
      const errorMessage = err.message || 'Unknown error occurred';
      setFetchError(`Failed to load projects: ${errorMessage}`);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectById = async ({ projectId }) => {
    try {
      setLoading(true);
      const response = await getProject(user.uid, projectId);
      // After standardization, unwrapResponse extracts data, so response is the project data
      setSingleProject(response);
      setFetchError('');
    } catch (err) {
      // With standardized responses, unwrapResponse extracts the error message
      const errorMessage = err.message || 'Unknown error occurred';
      console.error(`Failed to load project: ${errorMessage}`);
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
      // With standardized responses, unwrapResponse extracts the error message
      const errorMessage = err.message || 'Unknown error occurred';
      throw new Error(`Failed to create a new project: ${errorMessage}`);
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
      // With standardized responses, unwrapResponse extracts the error message
      const errorMessage = err.message || 'Unknown error occurred';
      throw new Error(`Failed to delete project ${project.projectid}: ${errorMessage}`);
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
      // With standardized responses, unwrapResponse extracts the error message
      const errorMessage = err.message || 'Unknown error occurred';
      throw new Error(`Bulk delete project fail: ${errorMessage}`);
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

  const saveProjectToBackend = async ({ projectId, updatedFilesArr}) => {
    setLoading(true); 

    try {
      const response = await saveProject(user.uid, projectId, updatedFilesArr); 
      // After standardization, unwrapResponse extracts data, so response is already the data
      console.log("Successfully save project to Backend: ", response); // Debug log
      setFetchError('');

    } catch (err) {
      // With standardized responses, unwrapResponse extracts the error message
      const errorMessage = err.message || 'Unknown error occurred';
      console.error(`Failed to save project: ${errorMessage}`);
      throw new Error(`Failed to save project with id ${projectId}`);

    } finally {
      setLoading(false);
    }
  }

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
        deleteOneProject,
        deleteProjectInBulk,
        saveProjectToBackend
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
