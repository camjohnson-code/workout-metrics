import './FAQSection.css';
import React from 'react';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FAQSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

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
                  <FaPlus />
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
                  <FaPlus />
                </>
              }
            >
              Nothing-it's free! It actually costs me a little to run this.
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
                  <FaPlus />
                </>
              }
            >
              Because this is Powered by Strava™, the speed is determined by the
              state of their servers. Typically, it will take a couple of
              minutes if this is your first time using this service.
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
                  <p>Can I request a feature?</p>
                  <FaPlus />
                </>
              }
            >
              Sure! You can <Link to='/contact'>fill out this form</Link> and
              let me know what you're thinking.
            </AccordionItem>
          </motion.div>
        </Accordion>
      </section>
      <motion.img
        className='strava-connect-btn'
        src={require('../../Images/btn_strava_connectwith_orange@2x.png')}
        alt='Strava Connect Button'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
        transition={{ duration: 1, ease: [0.17, 0.59, 0.24, 0.99], delay: 0.5 }}
      />
    </section>
  );
};

export default FAQSection;
