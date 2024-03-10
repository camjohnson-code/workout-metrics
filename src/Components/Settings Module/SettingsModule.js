import React, { useState } from 'react';
import './SettingsModule.css';

const SettingsModule = ({
  selectedTheme,
  selectedUnit,
  setSelectedTheme,
  setSelectedUnit,
  settingsShown,
  setSettingsShown,
}) => {
  const handleOkButton = () => {
    setSettingsShown(!settingsShown);
  };

  return (
    <section className='settings-module'>
      <section className='module'>
        <h1 className='module-title'>Settings</h1>
        <section className='setting'>
          <h2 className='setting-title'>Units</h2>
          <section className='setting-options'>
            <button
              className={`setting-option ${
                selectedUnit === 'Imperial' ? 'selected-option' : ''
              }`}
              onClick={() => setSelectedUnit('Imperial')}
            >
              Imperial
            </button>
            <button
              className={`setting-option ${
                selectedUnit === 'Metric' ? 'selected-option' : ''
              }`}
              onClick={() => setSelectedUnit('Metric')}
            >
              Metric
            </button>
          </section>
        </section>
        <section className='setting'>
          <h2 className='setting-title'>Theme</h2>
          <section className='setting-options'>
            <button
              className={`setting-option ${
                selectedTheme === 'Light' ? 'selected-option' : ''
              }`}
              onClick={() => setSelectedTheme('Light')}
            >
              Light
            </button>
            <button
              className={`setting-option ${
                selectedTheme === 'Dark' ? 'selected-option' : ''
              }`}
              onClick={() => setSelectedTheme('Dark')}
            >
              Dark
            </button>
          </section>
        </section>
        <button className='ok-button' onClick={handleOkButton}>
          OK
        </button>
      </section>
    </section>
  );
};

export default SettingsModule;
