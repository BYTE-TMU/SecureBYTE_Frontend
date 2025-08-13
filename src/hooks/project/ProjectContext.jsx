import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { createProject } from '@/api';
import { getProjects } from '@/api';

const ProjectContext = createContext();

export function ProjectProvider({ children, autoFetch = false }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]); 
  const [fetchError, setFetchError] = useState(''); 

  useEffect(() => {
    if (user && autoFetch) {
      fetchProjects(); 
    }
  }, [user, autoFetch]); 

  const fetchProjects = async () => {
    try {
      setLoading(true); 
      const response = await getProjects(user.uid); 
      setProjects(response.data); 
      setFetchError(''); 
    } catch(err) {
      setFetchError(`Failed to load projects: ${err.response?.data?.error || err.message}`); 
      setProjects([]); 
    }finally {
      setLoading(false); 
    }
  }

  const createNewProject = async ({ newProjectName, newProjectDesc }) => {
    //TODO: in the future, add an error
    if (!newProjectName.trim() || !user) return;

    try {
      setLoading(true); 

      const response = await createProject(user.uid, {
        project_name: newProjectName,
        project_desc: newProjectDesc || '',
        fileids: [],
      });

      // Success case: Refresh projects lists 
      await fetchProjects(); 
      setLoading(false); 

      return response; 
    } catch (err) {
      setLoading(false); 
      throw new Error(`Failed to create a new project: ${err.response?.data?.error || err.message}`); 
    }
  };

  const deleteProject = async () => {};

  return (
    <ProjectContext.Provider
      value={{
        user,
        loading,
        projects,
        fetchProjects,
        fetchError,
        createNewProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
