import { useAuth } from '@/hooks/auth/AuthContext';
import React from 'react';

export default function OldDashboard({
  error,
  user,
  selectedProject,
  handleSelectProject,
  currentView,
  setCurrentView,
  projects,
  editingProject,
  editProjectName,
  setEditProjectName,
  editProjectDesc,
  setEditProjectDesc,
  handleEditProject,
  handleUpdateProject,
  handleCancelProjectEdit,
  handleDeleteProject,
  newSubmissionFilename,
  setNewSubmissionFilename,
  newSubmissionCode,
  setNewSubmissionCode,
  newSecurityRev,
  setNewSecurityRev,
  newLogicRev,
  setNewLogicRev,
  newTestCases,
  setNewTestCases,
  newReviewPdf,
  setNewReviewPdf,
  handleCreateSubmissionWithFields,
  submissions,
  editingSubmission,
  handleEditSubmission,
  editSubmissionFilename,
  setEditSubmissionFilename,
  editSubmissionCode,
  setEditSubmissionCode,
  handleUpdateSubmission,
  handleCancelSubmissionEdit,
  handleDeleteSubmission,
}) {
  const { logout } = useAuth();
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
      className="flex-col"
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
          onClick={logout}
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
                background: currentView === 'submissions' ? '#007acc' : '#666',
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
            ></div>

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
                            <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>
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
                <label style={{ color: '#fff' }}>Security Review (JSON):</label>
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
                  style={{
                    padding: 8,
                    borderRadius: '4px',
                    border: 'none',
                  }}
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
                            <h5 style={{ margin: '0 0 5px 0', color: '#fff' }}>
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
                                  style={{
                                    color: '#ccc',
                                    fontSize: '12px',
                                  }}
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
