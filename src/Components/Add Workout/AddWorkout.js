import './AddWorkout.css';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ManualForm from '../Manual Form/ManualForm';
import FileUploader from '../File Uploader/FileUploader';
import PropTypes from 'prop-types';

const AddWorkout = ({ year, athlete }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [manualForm, setManualForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <section className='add-workout'>
      <NavBar />
      <Sidebar athlete={athlete} year={year}></Sidebar>
      <section className='upload-section'>
        {!submitted && !isMobile && <h1 className='upload-title'>Missing an activity?</h1>}
        {!submitted && !isMobile && (
          <p className='upload-subtitle'>
            Add your activity and we’ll add it to your Strava profile.
          </p>
        )}
        {!submitted &&
          (!manualForm ? (
            <FileUploader
              setSubmitted={setSubmitted}
              setManualForm={setManualForm}
              athlete={athlete}
            />
          ) : (
            <ManualForm
              setSubmitted={setSubmitted}
              manualForm={manualForm}
              setManualForm={setManualForm}
              athlete={athlete}
            />
          ))}
        {submitted && (
          <p className='submitted-message'>
            Submitted! Return to the{' '}
            <Link className='manual-link' to='/dashboard'>
              home page
            </Link>
            .
          </p>
        )}
      </section>
    </section>
  );
};

export default AddWorkout;


AddWorkout.propTypes = {
  year: PropTypes.number.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    profile: PropTypes.string.isRequired,
  }).isRequired,
};