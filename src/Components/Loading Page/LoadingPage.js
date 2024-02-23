// import React from 'react';
import React, { useEffect } from 'react';
import './LoadingPage.css';
import { handleAuthorizationCallback, getAthleteData, getAthleteActivities } from '../../ApiCalls';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  console.log('loading page rendered');
  const navigate = useNavigate();

  const fetchData = async () => {
    await handleAuthorizationCallback();
    await getAthleteData();
    await navigate('/dashboard');
    await getAthleteActivities();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return null;
};

export default LoadingPage;
