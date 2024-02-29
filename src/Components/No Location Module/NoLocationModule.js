import './NoLocationModule.css';
import { useState } from 'react';

const NoLocationModule = () => {
  const [readMessage, setReadMessage] = useState(false);

  return (
    <section className={`no-location-module ${readMessage ? 'hidden' : ''}`}>
      <h1 className='no-location-title'>Heads up!</h1>
      <p className='no-location-text'>
        You don't have your location set in your Strava profile! This app uses
        your location to load the map at your location. If you want the map to
        load at your city, you'll need to set your location in your Strava
        profile.
      </p>

      <button className='no-location-button' onClick={() => setReadMessage(true)}>Got it!</button>
    </section>
  );
};

export default NoLocationModule;
