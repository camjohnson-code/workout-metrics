import './NotLoggedInPage.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NotLoggedInPage = () => {
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
      className={`not-logged-in-page ${
        canUseWebP ? 'not-logged-in-webp' : 'not-logged-in-jpg'
      }`}
    >
      <h1 className='not-logged-in-title'>Please Sign In</h1>
      <p className='not-logged-in-text'>
        You must return to the home page and{' '}
        <Link className='must-sign-in-link' to='/'>
          sign in
        </Link>{' '}
        to view this page.
      </p>
    </section>
  );
};

export default NotLoggedInPage;
