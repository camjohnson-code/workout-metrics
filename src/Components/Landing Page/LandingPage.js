import './LandingPage.css';
import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import HeroSection from '../Hero Section/HeroSection';
import FeaturesSection from '../Features Section/FeaturesSection';
import FAQSection from '../FAQ Section/FAQSection';
import Footer from '../Footer/Footer';

const LandingPage = ({ year }) => {
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
    <main>
      <Header />
      <HeroSection canUseWebP={canUseWebP} />
      <FeaturesSection canUseWebP={canUseWebP} />
      <FAQSection />
      <Footer year={year} />
    </main>
  );
};

export default LandingPage;
