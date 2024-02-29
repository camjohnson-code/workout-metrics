import { useEffect } from 'react';
import { handleAuthorizationCallback } from '../../ApiCalls';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await handleAuthorizationCallback();
    await navigate('/loading');
  };

  return <section className='redirect-page'></section>;
};

export default RedirectPage;