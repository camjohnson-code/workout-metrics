import './FAQSection.css';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { redirectToStravaAuthorization } from '../../ApiCalls';

const FAQSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section className='faq' id='faq' ref={ref}>
      <motion.h3
        className='faq-title'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
        transition={{ duration: 1, ease: [0.17, 0.59, 0.24, 0.99] }}
      >
        Frequently Asked Questions
      </motion.h3>
      <section className='questions-section'>
        <Accordion transition transitionTimeout={250}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.1,
            }}
          >
            <AccordionItem
              header={
                <>
                  <p>How exactly does this work?</p>
                  <FaPlus className='plus-icon' />
                </>
              }
            >
              Click the "Connect with Strava" button. You'll be redirected to
              Strava where you'll need to authorize the use of our app. From
              there, you'll be redirected back here and we'll get to work
              displaying your data.
            </AccordionItem>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.2,
            }}
          >
            <AccordionItem
              header={
                <>
                  <p>What does this cost?</p>
                  <FaPlus className='plus-icon' />
                </>
              }
            >
              Nothing-it's free!
            </AccordionItem>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.3,
            }}
          >
            <AccordionItem
              header={
                <>
                  <p>How long will this take?</p>
                  <FaPlus className='plus-icon' />
                </>
              }
            >
              The time it takes to process your data is influenced by two main
              factors: the number of activities you have on Strava and the
              current state of Strava's servers. If you're new to Strava and
              have only a few activities, the process could be completed in a
              handful of seconds. However, if you've been using Strava for a
              while and have a large number of activities, it could take longer
              due to the increased amount of data. Additionally, the performance
              of Strava's servers can also affect the processing time. Please be
              patient as we work to pull in your data.
            </AccordionItem>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.4,
            }}
          >
            <AccordionItem
              header={
                <>
                  <p>Can I see a demo first?</p>
                  <FaPlus className='plus-icon' />
                </>
              }
            >
              Sure! You can{' '}
              <Link
                className='faq-link'
                to='https://youtu.be/saz7a-xCGQs'
              >
                watch a demo
              </Link>{' '}
              here.
            </AccordionItem>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.5,
            }}
          >
            <AccordionItem
              header={
                <>
                  <p>Can I request a feature?</p>
                  <FaPlus className='plus-icon' />
                </>
              }
            >
              Sure! You can{' '}
              <Link className='faq-link' to='/contact'>
                fill out this form
              </Link>{' '}
              and let me know what you're thinking.
            </AccordionItem>
          </motion.div>
        </Accordion>
      </section>
      <motion.button
        className='button-holder'
        tabIndex={0}
        aria-label='Connect with Strava'
        onClick={() => redirectToStravaAuthorization()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            redirectToStravaAuthorization();
          }
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
        transition={{ duration: 1, ease: [0.17, 0.59, 0.24, 0.99], delay: 0.5 }}
      >
        <img
          className='strava-connect-btn'
          src={require('../../Images/btn_strava_connectwith_orange@2x.png')}
          alt='Strava Connect Button'
        />
      </motion.button>
    </section>
  );
};

export default FAQSection;
