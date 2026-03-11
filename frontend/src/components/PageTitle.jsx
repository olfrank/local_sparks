import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/system') {
      document.title = 'CallGuard';
    } else if (location.pathname === '/demo-electrician-site') {
      document.title = 'CallGuard';
    } else {
      document.title = 'CallGuard';
    }
  }, [location]);

  return null;
};

export default PageTitle;
