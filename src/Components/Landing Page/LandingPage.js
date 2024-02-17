import './LandingPage.css';
import React from 'react';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { FaCheckCircle, FaPlus } from 'react-icons/fa';
import { Link } from 'react-scroll';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';

const LandingPage = () => {
  const year = new Date().getFullYear();

  const [openItem, setOpenItem] = useState(null);

  // Function to toggle the open/closed state of an item
  const toggleItem = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <main>
      <header className='header'>
        <a href='#home' className='header-link'>
          Home
        </a>
        <a href='#features' className='header-link'>
          Features
        </a>
        <a href='#faq' className='header-link'>
          FAQ
        </a>
      </header>
      <section className='hero-section'>
        <h1 className='title'>WorkoutMetrics.fit</h1>
        <p className='subtitle'>
          Empower your training with insightful metrics.
        </p>
        <img
          className='strava-connect-btn'
          src={require('../../Images/btn_strava_connectwith_orange@2x.png')}
          alt='Strava Connect Button'
        />
        <Link to='features' smooth={true} duration={1000}>
          <FaChevronDown className='down-icon' />
        </Link>
      </section>
      <section className='features' id='features'>
        <section className='features-images'>
          <img className='img-1' src={require('../../Images/chart.png')} />
          <img
            className='img-2'
            src={require('../../Images/shahadat-rahman-BfrQnKBulYQ-unsplash.jpg')}
          />
          <img className='img-3' src={require('../../Images/heatmap.png')} />
        </section>
        <section className='features-text'>
          <h2 className='feature-heading'>
            Unique tools for all your data visualization
          </h2>
          <p className='feature-subtitle'>
            Use our tools to track your data at a glance. Then share your
            achievements easily.
          </p>
          <ul>
            <li>
              <FaCheckCircle className='check' />
              <p>
                <span className='bold-text'>Heatmaps</span> - See where you’ve
                traveled
              </p>
            </li>
            <li>
              <FaCheckCircle className='check' />
              <p>
                <span className='bold-text'>Charts</span> - Your stats,
                visualized
              </p>
            </li>
            <li>
              <FaCheckCircle className='check' />
              <p>
                <span className='bold-text'>Easy share</span> - Showcase your
                achievements easily
              </p>
            </li>
          </ul>
        </section>
      </section>
      <section className='faq'>
        <h3 className='faq-title'>Frequently Asked Questions</h3>
        <section className='questions-section'>
          <Accordion transition transitionTimeout={250}>
            <AccordionItem
              header={
                <>
                  <p>How exactly does this work?</p>
                  <FaPlus />
                </>
              }
            >
              Click the "Connect with Strava" button. You'll be redirected to
              Strava where you'll need to authorize the use of our app. From
              there, you'll be redirected back here and we'll get to work
              displaying your data.
            </AccordionItem>

            <AccordionItem
              header={
                <>
                  <p>What does this cost?</p>
                  <FaPlus />
                </>
              }
            >
              Nothing-it's free! It actually costs me a little to run this.
            </AccordionItem>

            <AccordionItem
              header={
                <>
                  <p>How long will this take?</p>
                  <FaPlus />
                </>
              }
            >
              Because this is Powered by Strava™, the speed is determined by the
              state of their servers. Typically, it will take a couple of
              minutes if this is your first time using this service.
            </AccordionItem>

            <AccordionItem
              header={
                <>
                  <p>Can I request a feature?</p>
                  <FaPlus />
                </>
              }
            >
              Sure! You can fill out this form and let me know what you're
              thinking.
            </AccordionItem>
          </Accordion>
          {/* <div className='question-container'>
            <div className='question'>
              <p>How exactly does this work?</p>
              <FaPlus className='toggle' />
            </div>
            <div className='answer'>Just click the button.</div>
          </div>
          <div className='question'>
            <p>What does this cost?</p>
            <FaPlus className='toggle' />
          </div>
          <div className='question'>
            <p>How long will this take?</p>
            <FaPlus className='toggle' />
          </div>
          <div className='question'>
            <p>Can I request a feature?</p>
            <FaPlus className='toggle' />
          </div> */}
        </section>

        <img
          className='strava-connect-btn'
          src={require('../../Images/btn_strava_connectwith_orange@2x.png')}
          alt='Strava Connect Button'
        />
      </section>
      <footer className='footer'>
        <p>{`© Cameron Johnson, ${year}.`}</p>
        <img
          className='strava-power-btn'
          src={require('../../Images/api_logo_pwrdBy_strava_horiz_white.png')}
          alt='Strava Connect Button'
        />
      </footer>
    </main>
  );
};

export default LandingPage;
