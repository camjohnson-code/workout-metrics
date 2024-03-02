import './ContactForm.css';
import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactForm = ({year}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(null);
  const [error, setError] = useState(false);

  emailjs.init(process.env.REACT_APP_EMAILJS_API_KEY);

  const isFormValid = () => {
    return name && email && message;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          to_name: 'Cameron',
          from_name: name,
          from_email: email,
          message: message,
        }
      )
      .then(
        (response) => {
          setIsSuccessful(true);
        },
        (err) => {
          setError(true);
        }
      );
  };

  return (
    <section className='contact-form-page'>
      <h1 className='contact-title'>Drop me a line</h1>
      <form className='contact-form'>
        {isSuccessful === null && !error && (
          <>
            <label className='contact-label' htmlFor='name'>
              Name
            </label>
            <input
              className='contact-input'
              type='text'
              placeholder='Full Name'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className='contact-label' htmlFor='email'>
              Email address
            </label>
            <input
              className='contact-input'
              type='email'
              placeholder='Email address'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className='contact-label' htmlFor='message'>
              Comment
            </label>
            <textarea
              className='contact-message contact-input'
              placeholder='Leave your comment here...'
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className={`${!isFormValid() ? 'disabled' : ''} contact-button`}
              type='submit'
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        )}
        {isSuccessful && (
          <p className='contact-success'>Thanks for reaching out! Your message has been successfully sent. We'll get back to you soon!</p>
        )}
      </form>
      <footer className='contact-footer'>©Cameron Johnson {year}<img
          className='sidebar-strava-power-btn'
          src={require('../../Images/api_logo_pwrdBy_strava_horiz_white.png')}
          alt='Powered by Strava'
        /></footer>
    </section>
  );
};

export default ContactForm;
