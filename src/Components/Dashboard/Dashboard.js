import './Dashboard.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
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
    lineLayer.length > 0 &&
    lineLayer[Math.round(lineLayer.length / 2)]
      ? {
          longitude:
            lineLayer[Math.round(lineLayer.length / 2)].sourcePosition[0],
          latitude:
            lineLayer[Math.round(lineLayer.length / 2)].sourcePosition[1],
          zoom: 13,
          pitch: 0,
          bearing: 0,
        }
      : {};

  const layers = [
    new LineLayer({
      id: 'line-layer',
      data: lineLayer,
      getColor: () => [252, 76, 2],
      opacity: 0.1,
    }),
  ];

  return (
    <section className='dashboard-container'>
      <Sidebar year={year} athlete={athlete}></Sidebar>
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
          <p className='cell-main'>
            {recentActivityType === 'Swim'
              ? convertMtoYds(recentActivity.distance)
              : convertMtoMiles(recentActivity.distance)}
            <span className='unit'>
              {recentActivityType === 'Swim' ? 'yds' : 'mi'}
            </span>
          </p>
          <Link
            target='#'
            to={`https://www.strava.com/activities/${recentActivity.id}`}
            className='cell-subtitle view-link'
          >
            View on Strava <CiShare1 className='view-icon' />
          </Link>
        </Cell>
        <Cell className='cell cell-3'>
          <h1 className='cell-heading'>Achievements YTD</h1>
          <TbAwardFilled className='cell-icon achievements' />
          <p className='cell-main'>{achievements}</p>
          <p className='cell-subtitle'>Look at you go!</p>
        </Cell>
        <Cell className='cell cell-4'>
          <h1 className='cell-heading'>Today's high</h1>
          <CiTempHigh className='cell-icon weather' />
          <p className='cell-main'>{Math.round(weather.temp)}°</p>
          <p className='cell-subtitle'>Great day to go outside!</p>
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
            Based on your data, your training last week had{' '}
            {effortUp === 'up'
              ? 'more'
              : effortUp === 'down'
              ? 'less'
              : 'about the same amount of'}{' '}
            volume than the week prior.{' '}
            {effortUp === 'up' ? 'Way to get after it.' : null}
          </p>
        </Cell>
        <Cell className='cell cell-6'>
          <h1 className='cell-heading'>Longest Activity in {year}</h1>
          <IoMdStopwatch className='cell-icon longest-activity' />
          <div className='deckgl-container'>
            {longestYearActivity && longestYearActivity.start_latlng.length ? (
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
            ) : (
              <p className='no-gps'>Your longest activity had no GPS data!</p>
            )}
          </div>
          <Link
            target='#'
            to={`https://www.strava.com/activities/${longestYearActivity.id}`}
            className='cell-subtitle view-link'
          >
            View on Strava <CiShare1 className='view-icon' />
          </Link>
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
          <p className='cell-main quote'>{quote.quote}</p>
          <p className='cell-subtitle quote-subtitle'>- {quote.author}</p>
        </Cell>
      </section>
    </section>
  );
};

export default Dashboard;
