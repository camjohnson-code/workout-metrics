import './Header.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-scroll';

const Header = () => {
  const [faq, setFaq] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 2 * window.innerHeight) setFaq(true);
      else setFaq(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) setVisible(true);
      else setVisible(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${visible ? 'visible' : ''}`}>
      <Link
        tabIndex={0}
        to='home'
        smooth={true}
        duration={1000}
        className={`header-link ${faq ? 'header-dark' : ''}`}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            const homeElement = document.getElementById('home');
            homeElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Home
      </Link>
      <Link
        tabIndex={0}
        to='features'
        smooth={true}
        duration={1000}
        className={`header-link ${faq ? 'header-dark' : ''}`}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            const homeElement = document.getElementById('features');
            homeElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Features
      </Link>
      <Link
        tabIndex={0}
        to='faq'
        smooth={true}
        duration={1000}
        className={`header-link ${faq ? 'header-dark' : ''}`}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            const homeElement = document.getElementById('faq');
            homeElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        FAQ
      </Link>
    </header>
  );
};

export default Header;
