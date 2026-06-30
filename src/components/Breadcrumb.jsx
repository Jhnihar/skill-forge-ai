import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Route name mapping
  const routeNames = {
    dashboard: 'Dashboard',
    courses: 'Courses',
    jobs: 'Job List',
    'applied-jobs': 'Applied Jobs',
    profile: 'Profile',
    build: 'Build Workspace',
    test: 'Course Test',
    python: 'Python',
    html: 'HTML',
    css: 'CSS'
  };

  // Parse pathname into breadcrumb items
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Always start with Dashboard
  const breadcrumbs = [{ name: 'Dashboard', path: '/dashboard' }];
  
  // Build breadcrumb trail
  let currentPath = '';
  pathnames.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Skip dashboard if it's the first segment (already added)
    if (segment !== 'dashboard') {
      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === pathnames.length - 1
      });
    }
  });

  // Don't show breadcrumbs on dashboard itself or if only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {crumb.isLast ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {crumb.name}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
