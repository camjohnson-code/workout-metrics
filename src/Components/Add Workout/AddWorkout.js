import './AddWorkout.css';
import Sidebar from '../Sidebar/Sidebar';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ManualForm from '../Manual Form/ManualForm';
import FileUploader from '../File Uploader/FileUploader';

const AddWorkout = ({ year, athlete }) => {
  const [manualForm, setManualForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // useEffect(() => {
  //   handleSubmit();
  // }, [submitted]);

  return (
    <section className='add-workout'>
      <Sidebar athlete={athlete} year={year}></Sidebar>
      <section className='upload-section'>
        {!submitted && <h1 className='upload-title'>Missing an activity?</h1>}
        {!submitted && (
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
