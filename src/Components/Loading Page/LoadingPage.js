// import React from 'react';
import React, { useEffect } from 'react';
import './LoadingPage.css';
import { handleAuthorizationCallback, getAthleteData } from '../../ApiCalls';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();

  const fetchData = async () => {
    await handleAuthorizationCallback();
    await getAthleteData();
    await navigate('/');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='loading-page'>
      <h1>Loading...</h1>
    </div>
  );
};

export default LoadingPage;
