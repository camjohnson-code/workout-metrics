import { useEffect } from 'react';
import { handleAuthorizationCallback } from '../../ApiCalls';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RedirectPage = ({ isLoggedIn, setIsAuthorized }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) fetchData();
    else navigate('/dashboard');
  }, []);

  const fetchData = async () => {
    await handleAuthorizationCallback();
    Cookies.set('isAuthorized', true, { expires: 60, path: '/' });
    setIsAuthorized(true);
    navigate('/loading');
  };

  return <section className='redirect-page'></section>;
};

export default RedirectPage;