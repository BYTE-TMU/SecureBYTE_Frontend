import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';
import { useProject } from '@/hooks/project/ProjectContext';

export default function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { projects, singleProject } = useProject();

  // Build breadcrumb items based on current route
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Always start with Dashboard
    breadcrumbs.push({
      label: 'Dashboard',
      path: '/dashboard',
      icon: Home,
    });

    // Handle different routes
    if (pathSegments[0] === 'dashboard') {
      // Just dashboard - already have home
      return breadcrumbs;
    }

    if (pathSegments[0] === 'projects') {
      // Add Projects breadcrumb
      breadcrumbs.push({
        label: 'Projects',
        path: '/dashboard',
      });

      // If we have a projectId, add project name
      if (projectId) {
        // Try to get project name from singleProject or projects list
        let projectName = 'Project';
        
        if (singleProject && singleProject.project_name) {
          projectName = singleProject.project_name;
        } else {
          // Fallback to projects list
          const project = projects.find((p) => p.projectid === projectId);
          if (project) {
            projectName = project.project_name;
          }
        }

        breadcrumbs.push({
          label: projectName,
          path: `/projects/${projectId}`,
        });
      }
    }

    if (pathSegments[0] === 'code-editor') {
      breadcrumbs.push({
        label: 'Code Editor',
        path: '/code-editor',
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = crumb.icon;

        return (
          <React.Fragment key={crumb.path + index}>
            {/* Breadcrumb Item */}
            <button
              onClick={() => !isLast && handleNavigate(crumb.path)}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-md transition-colors
                ${
                  isLast
                    ? 'text-foreground font-medium cursor-default'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer'
                }
              `}
              disabled={isLast}
              aria-current={isLast ? 'page' : undefined}
            >
              {Icon && <Icon className="size-4" />}
              <span className="truncate max-w-[200px]">{crumb.label}</span>
            </button>

            {/* Separator */}
            {!isLast && (
              <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
