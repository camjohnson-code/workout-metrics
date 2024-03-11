import './AddWorkout.css';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import SettingsModule from '../Settings Module/SettingsModule';
import LoadingModule from '../Loading Module/LoadingModule';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ManualForm from '../Manual Form/ManualForm';
import FileUploader from '../File Uploader/FileUploader';
import PropTypes from 'prop-types';

const AddWorkout = ({
  setActivities,
  year,
  athlete,
  logout,
  selectedUnit,
  setSelectedUnit,
  selectedTheme,
  setSelectedTheme,
  settingsShown,
  setSettingsShown,
  isLoading,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [manualForm, setManualForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window?.innerWidth < 768);
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
      {isLoading && <LoadingModule />}
      {settingsShown && (
        <SettingsModule
          selectedUnit={selectedUnit}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          setSelectedUnit={setSelectedUnit}
          settingsShown={settingsShown}
          setSettingsShown={setSettingsShown}
        />
      )}
      <NavBar
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
      />
      <Sidebar
        selectedTheme={selectedTheme}
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
        athlete={athlete}
        year={year}
      ></Sidebar>
      <section className='upload-section'>
        {!submitted && !isMobile && (
          <h1 className='upload-title'>Missing an activity?</h1>
        )}
        {!submitted && !isMobile && (
          <p className='upload-subtitle'>
            Add your activity and we’ll add it to your Strava profile.
          </p>
        )}
        {!submitted &&
          (!manualForm ? (
            <FileUploader
              setActivities={setActivities}
              setSubmitted={setSubmitted}
              setManualForm={setManualForm}
              athlete={athlete}
              manualForm={manualForm}
            />
          ) : (
            <ManualForm
              setActivities={setActivities}
              setSubmitted={setSubmitted}
              manualForm={manualForm}
              setManualForm={setManualForm}
              athlete={athlete}
            />
          ))}
        {submitted && (
          <p className='submitted-message'>
            Submitted! Return to the{' '}
            <span
              className='manual-link'
              onClick={() => navigate('/dashboard')}
            >
              home page
            </span>
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
    city: PropTypes.string,
    state: PropTypes.string,
    profile: PropTypes.string.isRequired,
  }).isRequired,
};
