import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Configure axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

// Projects API - matching your backend exactly
export const getProjects = (userId) =>
  axios.get(`${API_URL}/users/${userId}/projects`);
export const createProject = (userId, project) =>
  axios.post(`${API_URL}/users/${userId}/projects`, project, {
    headers: { 'Content-Type': 'application/json' },
  });
export const updateProject = (userId, projectId, project) =>
  axios.put(`${API_URL}/users/${userId}/projects/${projectId}`, project, {
    headers: { 'Content-Type': 'application/json' },
  });
export const deleteProject = (userId, projectId) =>
  axios.delete(`${API_URL}/users/${userId}/projects/${projectId}`);

// Submissions API - matching your backend exactly
export const getSubmissions = (userId, projectId) =>
  axios.get(`${API_URL}/users/${userId}/projects/${projectId}/submissions`);
export const createSubmission = (userId, projectId, submission) =>
  axios.post(
    `${API_URL}/users/${userId}/projects/${projectId}/submissions`,
    submission,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
export const updateSubmission = (userId, submissionId, submission) =>
  axios.put(
    `${API_URL}/users/${userId}/submissions/${submissionId}`,
    submission,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
export const deleteSubmission = (userId, submissionId) =>
  axios.delete(`${API_URL}/users/${userId}/submissions/${submissionId}`);

// Legacy API (keeping for backward compatibility)
export const getItems = () => axios.get(`${API_URL}/items`);
export const createItem = (item) => axios.post(`${API_URL}/items`, item);
export const updateItem = (id, item) =>
  axios.put(`${API_URL}/items/${id}`, item);
export const deleteItem = (id) => axios.delete(`${API_URL}/items/${id}`);
