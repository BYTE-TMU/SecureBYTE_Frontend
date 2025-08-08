import React, { useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from 'firebase/auth';
import { app } from './firebase';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from './api';

import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
// Optional scopes for email access
githubProvider.addScope('read:user');
githubProvider.addScope('user:email');

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Project management state
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Project form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');

  // Submission form state
  const [newSubmissionFilename, setNewSubmissionFilename] = useState('');
  const [newSubmissionCode, setNewSubmissionCode] = useState('');
  const [newSecurityRev, setNewSecurityRev] = useState('');
  const [newLogicRev, setNewLogicRev] = useState('');
  const [newTestCases, setNewTestCases] = useState('');
  const [newReviewPdf, setNewReviewPdf] = useState('');
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editSubmissionFilename, setEditSubmissionFilename] = useState('');
  const [editSubmissionCode, setEditSubmissionCode] = useState('');

  // View state
  const [currentView, setCurrentView] = useState('projects'); // 'projects' or 'submissions'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        'Auth state changed:',
        user ? `User logged in: ${user.uid}` : 'User logged out',
      );
      setUser(user);
      if (user) {
        // Load projects when user is authenticated
        console.log('About to load projects for user:', user.uid);
        loadProjects();
      } else {
        // Reset state when user logs out
        setProjects([]);
        setSelectedProject(null);
        setSubmissions([]);
        setCurrentView('projects');
      }
    });
    return () => unsubscribe();
  }, []);

  // Project management functions
  const loadProjects = async () => {
    if (!user) return;
    console.log('Loading projects for user:', user.uid); // Debug log
    try {
      const response = await getProjects(user.uid);
      console.log('Projects response:', response.data); // Debug log
      setProjects(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error loading projects:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to load projects: ${
          error.response?.data?.error || error.message
        }`,
      );
      setProjects([]);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !user) return;

    console.log('Creating project for user:', user.uid); // Debug log
    console.log('Project data:', {
      project_name: newProjectName,
      project_desc: newProjectDesc,
    }); // Debug log

    try {
      const response = await createProject(user.uid, {
        project_name: newProjectName,
        project_desc: newProjectDesc || '',
        fileids: [],
      });
      console.log('Project created:', response.data); // Debug log
      setNewProjectName('');
      setNewProjectDesc('');
      loadProjects();
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error details:', error.response?.data); // More detailed error
      setError(
        `Failed to create project: ${
          error.response?.data?.error || error.message
        }`,
      );
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project.projectid);
    setEditProjectName(project.project_name);
    setEditProjectDesc(project.project_desc || '');
  };

  const handleUpdateProject = async (projectId) => {
    if (!editProjectName.trim() || !user) return;

    try {
      await updateProject(user.uid, projectId, {
        project_name: editProjectName,
        project_desc: editProjectDesc,
      });
      setEditingProject(null);
      setEditProjectName('');
      setEditProjectDesc('');
      loadProjects();
      setError('');
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!user) return;
    try {
      await deleteProject(user.uid, projectId);
      if (selectedProject?.projectid === projectId) {
        setSelectedProject(null);
        setSubmissions([]);
        setCurrentView('projects');
      }
      loadProjects();
      setError('');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project.');
    }
  };

  const handleCancelProjectEdit = () => {
    setEditingProject(null);
    setEditProjectName('');
    setEditProjectDesc('');
  };

  // Submission management functions
  const loadSubmissions = async (projectId) => {
    if (!user || !projectId) return;
    try {
      const response = await getSubmissions(user.uid, projectId);
      setSubmissions(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading submissions:', error);
      setError('Failed to load submissions.');
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentView('submissions');
    loadSubmissions(project.projectid);
  };

  const handleCreateSubmission = async () => {
    if (!newSubmissionFilename.trim() || !selectedProject || !user) return;

    try {
      await createSubmission(user.uid, selectedProject.projectid, {
        filename: newSubmissionFilename,
        code: newSubmissionCode || '',
        securityrev: [],
        logicrev: [],
        testcases: [],
        reviewpdf: '',
      });
      setNewSubmissionFilename('');
      setNewSubmissionCode('');
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error creating submission:', error);
      setError('Failed to create submission.');
    }
  };

  const handleCreateSubmissionWithFields = async () => {
    if (!newSubmissionFilename.trim() || !selectedProject || !user) return;
    try {
      await createSubmission(user.uid, selectedProject.projectid, {
        filename: newSubmissionFilename,
        code: newSubmissionCode || '',
        securityrev: newSecurityRev ? [newSecurityRev] : [],
        logicrev: newLogicRev ? [newLogicRev] : [],
        testcases: newTestCases ? [newTestCases] : [],
        reviewpdf: newReviewPdf,
      });
      setNewSubmissionFilename('');
      setNewSubmissionCode('');
      setNewSecurityRev('');
      setNewLogicRev('');
      setNewTestCases('');
      setNewReviewPdf('');
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error creating submission:', error);
      setError('Failed to create submission.');
    }
  };

  const handleEditSubmission = (submission) => {
    setEditingSubmission(submission.id);
    setEditSubmissionFilename(submission.filename);
    setEditSubmissionCode(submission.code || '');
  };

  const handleUpdateSubmission = async (submissionId) => {
    if (!editSubmissionFilename.trim() || !user) return;

    try {
      await updateSubmission(user.uid, submissionId, {
        filename: editSubmissionFilename,
        code: editSubmissionCode,
      });
      setEditingSubmission(null);
      setEditSubmissionFilename('');
      setEditSubmissionCode('');
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error updating submission:', error);
      setError('Failed to update submission.');
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!user) return;
    try {
      await deleteSubmission(user.uid, submissionId);
      loadSubmissions(selectedProject.projectid);
      setError('');
    } catch (error) {
      console.error('Error deleting submission:', error);
      setError('Failed to delete submission.');
    }
  };

  const handleCancelSubmissionEdit = () => {
    setEditingSubmission(null);
    setEditSubmissionFilename('');
    setEditSubmissionCode('');
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGithubSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err) {
      // Common error to surface clearly when account exists with different provider
      setError(err.message || 'GitHub sign-in failed');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            padding: 32,
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2>Welcome, {user.displayName || user.email}!</h2>
          <button
            onClick={handleSignOut}
            style={{ marginBottom: '20px', padding: '8px 16px' }}
          >
            Sign Out
          </button>

          {error && (
            <div
              style={{
                color: 'red',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setCurrentView('projects')}
              style={{
                padding: '8px 16px',
                background: currentView === 'projects' ? '#007acc' : '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Projects
            </button>
            {selectedProject && (
              <button
                onClick={() => setCurrentView('submissions')}
                style={{
                  padding: '8px 16px',
                  background:
                    currentView === 'submissions' ? '#007acc' : '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Submissions ({selectedProject.project_name})
              </button>
            )}
          </div>

          {currentView === 'projects' ? (
            // Projects View
            <>
              <h3>Project Management</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '20px',
                  width: '100%',
                }}
              >
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  style={{ padding: 8, borderRadius: '4px', border: 'none' }}
                />
                <textarea
                  placeholder="Project description (optional)"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: '4px',
                    border: 'none',
                    minHeight: '60px',
                  }}
                />
                <button
                  onClick={handleCreateProject}
                  style={{ padding: '8px 16px' }}
                >
                  Create Project
                </button>
              </div>

              <div style={{ width: '100%' }}>
                <h4>Projects List:</h4>
                {projects.length === 0 ? (
                  <p style={{ color: '#ccc' }}>No projects found</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                    {projects.map((project) => (
                      <li
                        key={project.projectid}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '15px',
                          margin: '10px 0',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                        }}
                      >
                        {editingProject === project.projectid ? (
                          // Edit mode
                          <>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginBottom: '10px',
                              }}
                            >
                              <input
                                type="text"
                                value={editProjectName}
                                onChange={(e) =>
                                  setEditProjectName(e.target.value)
                                }
                                style={{
                                  padding: '8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                }}
                              />
                              <textarea
                                value={editProjectDesc}
                                onChange={(e) =>
                                  setEditProjectDesc(e.target.value)
                                }
                                style={{
                                  padding: '8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  minHeight: '60px',
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button
                                onClick={() =>
                                  handleUpdateProject(project.projectid)
                                }
                                style={{
                                  background: 'green',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelProjectEdit}
                                style={{
                                  background: 'gray',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          // Display mode
                          <>
                            <div style={{ marginBottom: '10px' }}>
                              <h5
                                style={{ margin: '0 0 5px 0', color: '#fff' }}
                              >
                                {project.project_name}
                              </h5>
                              <p
                                style={{
                                  margin: 0,
                                  color: '#ccc',
                                  fontSize: '14px',
                                }}
                              >
                                {project.project_desc || 'No description'}
                              </p>
                              <small style={{ color: '#999' }}>
                                Created:{' '}
                                {new Date(
                                  project.created_at,
                                ).toLocaleDateString()}
                              </small>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button
                                onClick={() => handleSelectProject(project)}
                                style={{
                                  background: '#007acc',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                View Submissions
                              </button>
                              <button
                                onClick={() => handleEditProject(project)}
                                style={{
                                  background: 'blue',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                                className=""
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProject(project.projectid)
                                }
                                style={{
                                  background: 'red',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            // Submissions View
            <>
              <h3>Submissions for: {selectedProject.project_name}</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '20px',
                  width: '100%',
                }}
              >
                <input
                  type="text"
                  placeholder="Filename"
                  value={newSubmissionFilename}
                  onChange={(e) => setNewSubmissionFilename(e.target.value)}
                  style={{ padding: 8, borderRadius: '4px', border: 'none' }}
                />
                <textarea
                  placeholder="Code (optional)"
                  value={newSubmissionCode}
                  onChange={(e) => setNewSubmissionCode(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: '4px',
                    border: 'none',
                    minHeight: '100px',
                    fontFamily: 'monospace',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <label style={{ color: '#fff' }}>
                    Security Review (JSON):
                  </label>
                  <textarea
                    placeholder="Security Review JSON"
                    value={newSecurityRev}
                    onChange={(e) => setNewSecurityRev(e.target.value)}
                    style={{
                      padding: 8,
                      borderRadius: '4px',
                      border: 'none',
                      minHeight: '50px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <label style={{ color: '#fff' }}>Logic Review (JSON):</label>
                  <textarea
                    placeholder="Logic Review JSON"
                    value={newLogicRev}
                    onChange={(e) => setNewLogicRev(e.target.value)}
                    style={{
                      padding: 8,
                      borderRadius: '4px',
                      border: 'none',
                      minHeight: '50px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <label style={{ color: '#fff' }}>Test Cases (JSON):</label>
                  <textarea
                    placeholder="Test Cases JSON"
                    value={newTestCases}
                    onChange={(e) => setNewTestCases(e.target.value)}
                    style={{
                      padding: 8,
                      borderRadius: '4px',
                      border: 'none',
                      minHeight: '50px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <label style={{ color: '#fff' }}>
                    Review PDF (path or identifier):
                  </label>
                  <input
                    type="text"
                    placeholder="Review PDF Path/ID"
                    value={newReviewPdf}
                    onChange={(e) => setNewReviewPdf(e.target.value)}
                    style={{ padding: 8, borderRadius: '4px', border: 'none' }}
                  />
                </div>
                <button
                  onClick={() => {
                    handleCreateSubmissionWithFields();
                  }}
                  style={{ padding: '8px 16px' }}
                >
                  Add Submission
                </button>
              </div>

              <div style={{ width: '100%' }}>
                <h4>Submissions List:</h4>
                {submissions.length === 0 ? (
                  <p style={{ color: '#ccc' }}>No submissions found</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                    {submissions.map((submission) => (
                      <li
                        key={submission.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '15px',
                          margin: '10px 0',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                        }}
                      >
                        {editingSubmission === submission.id ? (
                          // Edit mode
                          <>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginBottom: '10px',
                              }}
                            >
                              <input
                                type="text"
                                value={editSubmissionFilename}
                                onChange={(e) =>
                                  setEditSubmissionFilename(e.target.value)
                                }
                                style={{
                                  padding: '8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                }}
                              />
                              <textarea
                                value={editSubmissionCode}
                                onChange={(e) =>
                                  setEditSubmissionCode(e.target.value)
                                }
                                style={{
                                  padding: '8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  minHeight: '100px',
                                  fontFamily: 'monospace',
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button
                                onClick={() =>
                                  handleUpdateSubmission(submission.id)
                                }
                                style={{
                                  background: 'green',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelSubmissionEdit}
                                style={{
                                  background: 'gray',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          // Display mode
                          <>
                            <div style={{ marginBottom: '10px' }}>
                              <h5
                                style={{ margin: '0 0 5px 0', color: '#fff' }}
                              >
                                {submission.filename}
                              </h5>
                              {submission.code && (
                                <pre
                                  style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    maxHeight: '150px',
                                    overflow: 'auto',
                                    margin: '5px 0',
                                    whiteSpace: 'pre-wrap',
                                  }}
                                >
                                  {submission.code}
                                </pre>
                              )}
                              {submission.securityrev &&
                                submission.securityrev.length > 0 && (
                                  <div style={{ margin: '5px 0' }}>
                                    <h6
                                      style={{
                                        margin: '0 0 3px 0',
                                        color: '#fff',
                                        fontSize: '14px',
                                      }}
                                    >
                                      Security Review:
                                    </h6>
                                    <pre
                                      style={{
                                        background: 'rgba(255,0,0,0.1)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        maxHeight: '100px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap',
                                      }}
                                    >
                                      {submission.securityrev.join('\n')}
                                    </pre>
                                  </div>
                                )}
                              {submission.logicrev &&
                                submission.logicrev.length > 0 && (
                                  <div style={{ margin: '5px 0' }}>
                                    <h6
                                      style={{
                                        margin: '0 0 3px 0',
                                        color: '#fff',
                                        fontSize: '14px',
                                      }}
                                    >
                                      Logic Review:
                                    </h6>
                                    <pre
                                      style={{
                                        background: 'rgba(0,255,0,0.1)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        maxHeight: '100px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap',
                                      }}
                                    >
                                      {submission.logicrev.join('\n')}
                                    </pre>
                                  </div>
                                )}
                              {submission.testcases &&
                                submission.testcases.length > 0 && (
                                  <div style={{ margin: '5px 0' }}>
                                    <h6
                                      style={{
                                        margin: '0 0 3px 0',
                                        color: '#fff',
                                        fontSize: '14px',
                                      }}
                                    >
                                      Test Cases:
                                    </h6>
                                    <pre
                                      style={{
                                        background: 'rgba(0,0,255,0.1)',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        maxHeight: '100px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap',
                                      }}
                                    >
                                      {submission.testcases.join('\n')}
                                    </pre>
                                  </div>
                                )}
                              {submission.reviewpdf && (
                                <div style={{ margin: '5px 0' }}>
                                  <h6
                                    style={{
                                      margin: '0 0 3px 0',
                                      color: '#fff',
                                      fontSize: '14px',
                                    }}
                                  >
                                    Review PDF:
                                  </h6>
                                  <span
                                    style={{ color: '#ccc', fontSize: '12px' }}
                                  >
                                    {submission.reviewpdf}
                                  </span>
                                </div>
                              )}
                              <small style={{ color: '#999' }}>
                                Created:{' '}
                                {new Date(
                                  submission.created_at,
                                ).toLocaleDateString()}
                              </small>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button
                                onClick={() => handleEditSubmission(submission)}
                                style={{
                                  background: 'blue',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSubmission(submission.id)
                                }
                                style={{
                                  background: 'red',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return isSignUp ? (
    <LoginPage
      handleSubmit={handleSubmit}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
      handleGoogleSignIn={handleGoogleSignIn}
      handleGithubSignIn={handleGithubSignIn}
      error={error}
      setIsSignUp={setIsSignUp}
      email={email}
      password={password}
    />
  ) : (
    <SignupPage
      handleSubmit={handleSubmit}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
      handleGoogleSignIn={handleGoogleSignIn}
      handleGithubSignIn={handleGithubSignIn}
      error={error}
      setIsSignUp={setIsSignUp}
      email={email}
      password={password}
    />
  );
}

export default App;
