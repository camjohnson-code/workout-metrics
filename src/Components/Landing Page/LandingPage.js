import './LandingPage.css';
import React from 'react';
import Header from '../Header/Header';
import HeroSection from '../Hero Section/HeroSection';
import FeaturesSection from '../Features Section/FeaturesSection';
import FAQSection from '../FAQ Section/FAQSection';
import Footer from '../Footer/Footer';

const LandingPage = () => {
  return (
    <main>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
