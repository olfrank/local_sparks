import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = (): null => {
  const location = useLocation();

  useEffect(() => {
    document.title = 'CallGuard';
  }, [location]);

  return null;
};

export default PageTitle;
