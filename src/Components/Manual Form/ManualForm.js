import './ManualForm.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserFromAPI, postActivity } from '../../ApiCalls';

const ManualForm = ({ athlete, setManualForm, manualForm, setSubmitted }) => {
  const [error, setError] = useState(false);
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [elevation, setElevation] = useState('');
  const [elevationUnit, setElevationUnit] = useState('feet');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const isFormValid = () => {
    return (
      distance &&
      elevation &&
      hours &&
      minutes &&
      seconds &&
      type &&
      title &&
      date &&
      description
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const athleteInfo = await getUserFromAPI(athlete.id);
    const accessToken = athleteInfo.data.stravaAccessToken;

    const activityData = {
      name: title,
      type: type,
      start_date_local: `${date}T${time}`,
      elapsed_time:
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds),
      description: description,
      distance:
        distanceUnit === 'miles'
          ? parseFloat(distance) * 1609.34
          : parseFloat(distance) * 1000,
      total_elevation_gain:
        elevationUnit === 'feet'
          ? parseFloat(elevation) / 3.281
          : parseFloat(elevation),
    };

    const response = await postActivity(activityData, accessToken);

    if (response.ok) setSubmitted(true);
    else setError(true);
  };

  return (
    <form className='manual-form' onSubmit={handleSubmit}>
      {!error ? (
        <p className='manual-upload-instruction'>
          Have a file? You can add it{' '}
          <Link
            onClick={() => setManualForm(!manualForm)}
            className='manual-link'
          >
            here
          </Link>
          .
        </p>
      ) : (
        <p className='manual-upload-instruction'>
          There was an error submitting your activity. Please try again.
        </p>
      )}
      <section className='manual-form-inputs'>
        <section className='distance-input'>
          <label htmlFor='distance'>Distance</label>
          <input
            className='manual-form-input'
            type='number'
            id='distance'
            name='distance'
            required
            placeholder='Distance'
            onChange={(e) => {
              setDistance(e.target.value);
            }}
            value={distance}
          />
          <select
            required
            onChange={(e) => setDistanceUnit(e.target.value)}
            className='manual-form-input'
            value={distanceUnit}
          >
            <option className='manual-form-input' value='miles'>
              Miles
            </option>
            <option className='manual-form-input' value='kilometers'>
              Kilometers
            </option>
          </select>
        </section>
        <section className='elevation-input'>
          <label htmlFor='elevation'>Elevation</label>
          <input
            className='manual-form-input'
            type='number'
            id='elevation'
            name='elevation'
            required
            placeholder='Elevation'
            onChange={(e) => {
              setElevation(e.target.value);
            }}
            value={elevation}
          />
          <select
            required
            onChange={(e) => setElevationUnit(e.target.value)}
            className='manual-form-input'
            value={elevationUnit}
          >
            <option className='manual-form-input' value='feet'>
              Feet
            </option>
            <option className='manual-form-input' value='meters'>
              Meters
            </option>
          </select>
        </section>
        <section className='duration-input'>
          <label htmlFor='hours'>Duration</label>
          <input
            className='manual-form-input'
            type='number'
            id='hours'
            name='hours'
            required
            placeholder='Hours'
            onChange={(e) => {
              setHours(e.target.value);
            }}
            value={hours}
          />
          <label htmlFor='minutes'>:</label>
          <input
            className='manual-form-input'
            type='number'
            id='minutes'
            name='minutes'
            required
            placeholder='Minutes'
            onChange={(e) => {
              setMinutes(e.target.value);
            }}
            value={minutes}
          />
          <label htmlFor='seconds'>:</label>
          <input
            className='manual-form-input'
            type='number'
            id='seconds'
            name='seconds'
            required
            placeholder='Seconds'
            onChange={(e) => {
              setSeconds(e.target.value);
            }}
            value={seconds}
          />
        </section>
        <section className='type-input'>
          <label htmlFor='type'>Type</label>
          <select
            required
            id='type'
            name='type'
            onChange={(e) => setType(e.target.value)}
            className='manual-form-input'
            value={type}
          >
            <option className='manual-form-input' value='default'>
              Select a type
            </option>
            <option className='manual-form-input' value='run'>
              Run
            </option>
            <option className='manual-form-input' value='ride'>
              Ride
            </option>
            <option className='manual-form-input' value='swim'>
              Swim
            </option>
            <option className='manual-form-input' value='weight lifting'>
              Weight Lifting
            </option>
          </select>
        </section>
        <section className='title-input'>
          <label htmlFor='title'>Title</label>
          <input
            className='manual-form-input'
            type='text'
            id='title'
            name='title'
            required
            placeholder='Title'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </section>
        <section className='date-input'>
          <label htmlFor='date'>Date & Time</label>
          <input
            className='manual-form-input'
            type='date'
            id='date'
            name='date'
            required
            max={formattedDate}
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />
          <input
            className='manual-form-input'
            type='time'
            id='time'
            name='time'
            required
            onChange={(e) => setTime(e.target.value)}
            value={time}
          />
        </section>
        <section className='description-input'>
          <label htmlFor='description'>Description</label>
          <textarea
            className='manual-form-input description-box'
            type='text'
            id='description'
            name='description'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder='How’d it go? Share more about your activity.'
          />
        </section>
      </section>
      <button
        type='submit'
        disabled={!isFormValid()}
        className='submit-button manual-form-submit'
      >
        Submit
      </button>
    </form>
  );
};

export default ManualForm;
