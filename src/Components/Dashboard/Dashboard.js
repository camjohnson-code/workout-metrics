import './Dashboard.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import {
  FaCalendarDays,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from 'react-icons/fa6';
import { LuActivity, LuTally5 } from 'react-icons/lu';
import { CiShare1 } from 'react-icons/ci';
import { TbAwardFilled } from 'react-icons/tb';
import { IoMdStopwatch, IoMdQuote } from 'react-icons/io';
import { MdTrendingFlat } from 'react-icons/md';
import { CiTempHigh } from 'react-icons/ci';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import GL from '@luma.gl/constants';
import PropTypes from 'prop-types';

const Dashboard = ({
  year,
  athlete,
  recentActivity,
  convertMtoYds,
  streak,
  achievements,
  weather,
  quote,
  longestYearActivity,
  effortUp,
  lineLayer,
  convertMtoMiles,
  logout,
}) => {
  const recentActivityType = recentActivity.type;

  const date = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });

  const Cell = ({ className, children }) => {
    return <section className={className}>{children}</section>;
  };

  const INITIAL_VIEW_STATE =
    lineLayer &&
    lineLayer?.length > 0 &&
    lineLayer[Math.round(lineLayer.length / 2)]
      ? {
          longitude:
            lineLayer[Math.round(lineLayer?.length / 2)].sourcePosition[0],
          latitude:
            lineLayer[Math.round(lineLayer?.length / 2)].sourcePosition[1],
          zoom: 13,
          pitch: 0,
          bearing: 0,
        }
      : {};

  const layers = [
    new LineLayer({
      id: 'line-layer',
      data: lineLayer,
      getColor: () => [138, 169, 249],
      opacity: 0.1,
    }),
  ];

  const generateWeatherSubtitle = () => {
    if (weather.temp < 40) return 'Bundle up!';
    if (weather.temp >= 40 && weather.temp < 60)
      return 'Slightly on the cooler side.';
    if (weather.temp >= 60 && weather.temp < 80) return 'Perfect weather!';
    if (weather.temp >= 80) return 'Stay cool. It\'s a hot one out there!';
  };

  return (
    <section className='dashboard-container'>
      <NavBar logout={logout} />
      <Sidebar logout={logout} year={year} athlete={athlete}></Sidebar>
      <section className='dashboard'>
        <Cell className='cell cell-1'>
          <h1 className='cell-heading'>Date</h1>
          <FaCalendarDays className='cell-icon calendar' />
          <p className='cell-main'>{date}</p>
          <p className='cell-subtitle'>{year}</p>
        </Cell>
        <Cell className='cell cell-2'>
          <h1 className='cell-heading'>Last Activity</h1>
          <LuActivity className='cell-icon activity' />
          {JSON.stringify(recentActivity) ===
          JSON.stringify({ distance: 0, moving_time: 0, type: '', id: 0 }) ? (
            <p className='cell-main no-activities'>
              You have no activities on Strava!
            </p>
          ) : (
            <p className='cell-main'>
              {recentActivityType === 'Swim'
                ? convertMtoYds(recentActivity?.distance)
                : convertMtoMiles(recentActivity?.distance)}
              <span className='unit'>
                {recentActivityType === 'Swim' ? 'yds' : 'mi'}
              </span>
            </p>
          )}
          {JSON.stringify(recentActivity) ===
          JSON.stringify({ distance: 0, moving_time: 0, type: '', id: 0 }) ? (
            ''
          ) : (
            <Link
              target='#'
              to={`https://www.strava.com/activities/${recentActivity?.id}`}
              className='cell-subtitle view-link'
            >
              View on Strava <CiShare1 className='view-icon' />
            </Link>
          )}
        </Cell>
        <Cell className='cell cell-3'>
          <h1 className='cell-heading'>Achievements YTD</h1>
          <TbAwardFilled className='cell-icon achievements' />
          <p className='cell-main'>{achievements}</p>
          <p className='cell-subtitle'>
            {!achievements ? '' : 'Look at you go!'}
          </p>
        </Cell>
        <Cell className='cell cell-4'>
          <h1 className='cell-heading'>Today's high</h1>
          <CiTempHigh className='cell-icon weather' />
          {athlete?.city ? (
            <p className='cell-main'>{Math.round(weather.temp)}°</p>
          ) : (
            <p>You don't have your location set in your Strava profile!</p>
          )}
          {athlete?.city && (
            <p className='cell-subtitle'>{generateWeatherSubtitle()}</p>
          )}
        </Cell>
        <Cell className='cell cell-5'>
          <h1 className='cell-heading'>Relative Effort</h1>
          {effortUp === 'up' ? (
            <FaArrowTrendUp className='cell-icon relative-effort-up' />
          ) : effortUp === 'down' ? (
            <FaArrowTrendDown className='cell-icon relative-effort-down' />
          ) : (
            <MdTrendingFlat className='cell-icon relative-effort-same' />
          )}
          <p className='cell-main'>
            {effortUp === 'up'
              ? 'Trending higher'
              : effortUp === 'down'
              ? 'Rest week'
              : 'Holding steady'}
          </p>
          <p className='cell-subtitle long-subtitle'>
            Based on your data, your training this week had{' '}
            {effortUp === 'up'
              ? 'more'
              : effortUp === 'down'
              ? 'less'
              : 'about the same amount of'}{' '}
            volume {effortUp === 'same' ? 'as' : 'than'} the week prior.{' '}
            {effortUp === 'up' ? 'Way to get after it.' : null}
          </p>
        </Cell>
        <Cell className='cell cell-6'>
          <h1 className='cell-heading'>Longest Activity in {year}</h1>
          <IoMdStopwatch className='cell-icon longest-activity' />
          {longestYearActivity &&
          longestYearActivity?.start_latlng?.length > 0 ? (
            <div className='deckgl-container'>
              <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                parameters={{
                  blend: true,
                  blendFunc: [
                    GL.SRC_ALPHA,
                    GL.ONE,
                    GL.ONE_MINUS_DST_ALPHA,
                    GL.ONE,
                  ],
                  blendEquation: GL.FUNC_ADD,
                }}
              >
                <Map
                  mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                  mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                  attributionControl={false}
                />
              </DeckGL>
            </div>
          ) : null}

          {longestYearActivity && !longestYearActivity?.start_latlng?.length ? (
            <p className='no-gps'>Your longest activity had no GPS data!</p>
          ) : null}

          {longestYearActivity &&
          longestYearActivity?.start_latlng?.length > 0 ? (
            <Link
              target='#'
              to={`https://www.strava.com/activities/${longestYearActivity.id}`}
              className='cell-subtitle view-link'
            >
              View on Strava <CiShare1 className='view-icon' />
            </Link>
          ) : null}
        </Cell>
        <Cell className='cell cell-7'>
          <h1 className='cell-heading'>Activity Streak</h1>
          <LuTally5 className='cell-icon streak' />
          <p className='cell-main'>
            {streak}{' '}
            <span className='unit'>{streak !== 1 ? 'days' : 'day'}</span>
          </p>
          <p className='cell-subtitle'>
            {streak ? 'Keep going!' : "Let's get started today!"}
          </p>
        </Cell>
        <Cell className='cell cell-8'>
          <h1 className='cell-heading'>Your Daily Kick in the Butt</h1>
          <IoMdQuote className='cell-icon quote-icon' />
          <p className='cell-main quote'>{quote?.quote}</p>
          <p className='cell-subtitle quote-subtitle'>- {quote?.author}</p>
        </Cell>
      </section>
    </section>
  );
};

export default Dashboard;

Dashboard.propTypes = {
  year: PropTypes.number.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string,
    state: PropTypes.string,
    profile: PropTypes.string.isRequired,
  }).isRequired,
  recentActivity: PropTypes.shape({
    distance: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  convertMtoYds: PropTypes.func.isRequired,
  streak: PropTypes.number.isRequired,
  achievements: PropTypes.number.isRequired,
  weather: PropTypes.shape({
    temp: PropTypes.number.isRequired,
  }).isRequired,
  quote: PropTypes.shape({
    quote: PropTypes.string.isRequired,
  }),
  longestYearActivity: PropTypes.shape({
    distance: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    start_latlng: PropTypes.array.isRequired,
  }).isRequired,
  effortUp: PropTypes.string.isRequired,
  lineLayer: PropTypes.arrayOf(
    PropTypes.shape({
      sourcePosition: PropTypes.arrayOf(PropTypes.number).isRequired,
      targetPosition: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  convertMtoMiles: PropTypes.func.isRequired,
};
