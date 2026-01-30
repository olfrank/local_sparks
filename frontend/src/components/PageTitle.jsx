import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/system') {
      document.title = 'Revenue-Capture System for Electricians | Bucks Electricians';
    } else if (location.pathname === '/demo-electrician-site') {
      document.title = 'Demo Electrician Website | Bucks Electricians';
    } else {
      document.title = 'Bucks Electricians';
    }
  }, [location]);

  return null;
};

export default PageTitle;
