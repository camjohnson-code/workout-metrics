import { useEffect } from 'react';
import { handleAuthorizationCallback } from '../../ApiCalls';
import { useNavigate } from 'react-router-dom';

const RedirectPage = ({ login }) => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await handleAuthorizationCallback();
    login();
    await navigate('/loading');
  };

  return <section className='redirect-page'></section>;
};

export default RedirectPage;
