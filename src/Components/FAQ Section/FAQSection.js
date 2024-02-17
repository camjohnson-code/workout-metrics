import './FAQSection.css';
import React from 'react';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Accordion, AccordionItem } from '@szhsin/react-accordion';

const FAQSection = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <section className='faq' id='faq'>
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
            state of their servers. Typically, it will take a couple of minutes
            if this is your first time using this service.
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
      </section>
      <img
        className='strava-connect-btn'
        src={require('../../Images/btn_strava_connectwith_orange@2x.png')}
        alt='Strava Connect Button'
      />
    </section>
  );
};

export default FAQSection;
