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
    <header className='header'>
      <Link
        to='home'
        smooth={true}
        duration={1000}
        className={`header-link ${faq ? 'header-dark' : ''} ${
          !visible ? 'hidden' : ''
        }`}
      >
        Home
      </Link>
      <Link
        to='features'
        smooth={true}
        duration={1000}
        className={`header-link ${faq ? 'header-dark' : ''} ${
          !visible ? 'hidden' : ''
        }`}
      >
        Features
      </Link>
      <Link
        to='faq'
        smooth={true}
        duration={1000}
        className={`header-link ${faq ? 'header-dark' : ''} ${
          !visible ? 'hidden' : ''
        }`}
      >
        FAQ
      </Link>
    </header>
  );
};

export default Header;
