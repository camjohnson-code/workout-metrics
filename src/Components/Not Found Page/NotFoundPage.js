import './NotFoundPage.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = ({ isLoggedIn }) => {
  const [canUseWebP, setCanUseWebP] = useState(true);

  useEffect(() => {
    getWebPAvailability();
  }, []);

  const getWebPAvailability = () => {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) setCanUseWebP(true);
    else setCanUseWebP(false);
  };

  return (
    <section
      className={`not-found-page ${
        canUseWebP ? 'not-found-webp' : 'not-found-jpg'
      }`}
    >
      <h1 className='not-found-title'>Page not found!</h1>
      <p className='not-found-subtitle'>
        Click{' '}
        <Link className='not-found-link' to={isLoggedIn ? '/dashboard' : '/'}>
          here
        </Link>{' '}
        to return {isLoggedIn ? 'to the dashboard' : 'home'}.
      </p>
    </section>
  );
};

export default NotFoundPage;
