import { useEffect } from 'react';
import { handleAuthorizationCallback } from '../../ApiCalls';
import { useNavigate } from 'react-router-dom';

const RedirectPage = ({ isLoggedIn, setIsAuthorized }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) fetchData();
    else navigate('/dashboard');
  }, []);

  const fetchData = async () => {
    await handleAuthorizationCallback();
    await setIsAuthorized(true);
    await navigate('/loading');
  };

  return <section className='redirect-page'></section>;
};

export default RedirectPage;
