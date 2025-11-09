import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

// Configure axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

// Helper to unwrap standardized backend responses
// Backend now returns: {success: true, data: ..., meta: ...} or {success: false, error: ...}
const unwrapResponse = (response) => {
  // If response has the new standardized structure, extract data
  if (response.data && typeof response.data === 'object' && 'success' in response.data) {
    if (response.data.success) {
      // Return the data field, or the whole response if data is undefined
      return response.data.data !== undefined ? response.data.data : response.data;
    } else {
      // For errors, throw to maintain error handling behavior
      const error = new Error(response.data.error?.message || 'Request failed');
      error.response = response;
      error.code = response.data.error?.code;
      error.detail = response.data.error?.detail;
      throw error;
    }
  }
  // Fallback for legacy responses without the wrapper
  return response.data;
};

// Projects API - matching your backend exactly
export const getProjects = (userId) =>
  axios.get(`${API_URL}/users/${userId}/projects`).then(unwrapResponse);
export const createProject = (userId, project) =>
  axios.post(`${API_URL}/users/${userId}/projects`, project, {
    headers: { 'Content-Type': 'application/json' },
  }).then(unwrapResponse);
export const updateProject = (userId, projectId, project) =>
  axios.put(`${API_URL}/users/${userId}/projects/${projectId}`, project, {
    headers: { 'Content-Type': 'application/json' },
  }).then(unwrapResponse);
export const deleteProject = (userId, projectId) =>
  axios.delete(`${API_URL}/users/${userId}/projects/${projectId}`).then(unwrapResponse);
export const getProject = (userId, projectId) =>
  axios.get(`${API_URL}/users/${userId}/projects/${projectId}`).then(unwrapResponse);

export const saveProject = (userId, projectId, updatedFilesArr) =>
  axios.put(
    `${API_URL}/users/${userId}/projects/${projectId}/save`,
    updatedFilesArr,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ).then(unwrapResponse);

// AI Review API
export const getSecurityReview = (userId, projectId) =>
  axios.post(
    `${API_URL}/users/${userId}/projects/${projectId}/security-review`,
    {},
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ).then(unwrapResponse);

export const getLogicReview = (userId, submissionId, activeFile) =>
  axios.post(
    `${API_URL}/users/${userId}/submissions/${submissionId}/logic-review`,
    activeFile, 
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ).then(unwrapResponse);

export const getTestCases = (userId, submissionId, activeFile) =>
  axios.post(
    `${API_URL}/users/${userId}/submissions/${submissionId}/testing-review`,
    activeFile, 
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ).then(unwrapResponse);

// File submissions API - matching your backend exactly
export const getSubmissions = (userId, projectId) =>
  axios.get(`${API_URL}/users/${userId}/projects/${projectId}/submissions`).then(unwrapResponse);
export const createSubmission = (userId, projectId, submission) =>
  axios.post(
    `${API_URL}/users/${userId}/projects/${projectId}/submissions`,
    submission,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ).then(unwrapResponse);
export const updateSubmission = (userId, submissionId, submission) =>
  axios.put(
    `${API_URL}/users/${userId}/submissions/${submissionId}`,
    submission,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ).then(unwrapResponse);
export const deleteSubmission = (userId, submissionId) =>
  axios.delete(`${API_URL}/users/${userId}/submissions/${submissionId}`).then(unwrapResponse);

// Legacy API (keeping for backward compatibility)
export const getItems = () => axios.get(`${API_URL}/items`);
export const createItem = (item) => axios.post(`${API_URL}/items`, item);
export const updateItem = (id, item) =>
  axios.put(`${API_URL}/items/${id}`, item);
export const deleteItem = (id) => axios.delete(`${API_URL}/items/${id}`);

// ===== GitHub Integration =====
export const listGithubRepos = (userId, { perPage = 100, page = 1 } = {}) =>
  axios.get(`${API_URL}/users/${userId}/github/repos`, {
    params: { per_page: perPage, page },
    headers: (() => {
      const token =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('github_access_token')
          : undefined;
      return token ? { Authorization: `Bearer ${token}` } : {};
    })(),
  }).then(unwrapResponse);

export const linkGithubRepo = (
  userId,
  projectId,
  { repo_full_name, branch = 'main' },
) =>
  axios.post(
    `${API_URL}/users/${userId}/projects/${projectId}/github/link`,
    { repo_full_name, branch },
    {
      headers: (() => {
        const token =
          typeof localStorage !== 'undefined'
            ? localStorage.getItem('github_access_token')
            : undefined;
        return token ? { Authorization: `Bearer ${token}` } : {};
      })(),
    },
  ).then(unwrapResponse);

export const importGithubRepo = (
  userId,
  projectId,
  { repo_full_name, branch, max_files, max_bytes } = {},
) =>
  axios.post(
    `${API_URL}/users/${userId}/projects/${projectId}/github/import`,
    { repo_full_name, branch, max_files, max_bytes },
    {
      headers: (() => {
        const token =
          typeof localStorage !== 'undefined'
            ? localStorage.getItem('github_access_token')
            : undefined;
        return token ? { Authorization: `Bearer ${token}` } : {};
      })(),
    },
  ).then(unwrapResponse);
