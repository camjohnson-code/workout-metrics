import './Dashboard.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { FaCalendarDays, FaArrowTrendUp } from 'react-icons/fa6';
import { LuActivity } from 'react-icons/lu';
import { CiShare1 } from 'react-icons/ci';
import { TbAwardFilled } from 'react-icons/tb';
import { IoMdStopwatch } from 'react-icons/io';

const Dashboard = ({ year }) => {
  const Cell = ({ className, children }) => {
    return <section className={className}>{children}</section>;
  };

  return (
    <section className='dashboard-container'>
      <Sidebar year={year}></Sidebar>
      <section className='dashboard'>
        <Cell className='cell cell-1'>
          <h1 className='cell-heading'>Date</h1>
          <FaCalendarDays className='cell-icon calendar' />
          <p className='cell-main'>Feb 24</p>
          <p className='cell-subtitle'>{year}</p>
        </Cell>
        <Cell className='cell cell-2'>
          <h1 className='cell-heading'>Last Activity</h1>
          <LuActivity className='cell-icon activity' />
          <p className='cell-main'>
            56<span className='unit'>mi</span>
          </p>
          <Link
            target='#'
            to='https://www.strava.com'
            className='cell-subtitle view-link'
          >
            View on Strava <CiShare1 className='view-icon' />
          </Link>
        </Cell>
        <Cell className='cell cell-3'>
          <h1 className='cell-heading'>Achievements YTD</h1>
          <TbAwardFilled className='cell-icon achievements' />
          <p className='cell-main'>108</p>
          <p className='cell-subtitle'>Look at you go!</p>
        </Cell>
        <Cell className='cell cell-4'>
          <h1 className='cell-heading'>Weather</h1>
          <TbAwardFilled className='cell-icon weather' />
          <p className='cell-main'>58°</p>
          <p className='cell-subtitle'>Great day to go outside!</p>
        </Cell>
        <Cell className='cell cell-5'>
          <h1 className='cell-heading'>Relative Effort</h1>
          <FaArrowTrendUp className='cell-icon relative-effort' />
          <p className='cell-main'>Trending higher</p>
          <p className='cell-subtitle long-subtitle'>
            Based on your data, your training last week had more volume than
            usual. Way to get after it.
          </p>
        </Cell>
        <Cell className='cell cell-6'>
          <h1 className='cell-heading'>Longest Activity in {year}</h1>
          <IoMdStopwatch className='cell-icon longest-activity' />
          <p className='cell-main map'>
            <img
              className='sidebar-strava-power-btn'
              src={require('../../Images/api_logo_pwrdBy_strava_horiz_white.png')}
              alt='Powered by Strava'
            />
          </p>
          <Link
            target='#'
            to='https://www.strava.com'
            className='cell-subtitle view-link'
          >
            View on Strava <CiShare1 className='view-icon' />
          </Link>
        </Cell>
        <Cell className='cell cell-7'>
          <h1 className='cell-heading'>Activity Streak</h1>
          <FaArrowTrendUp className='cell-icon relative-effort' />
          <p className='cell-main'>
            1 <span className='unit'>day</span>
          </p>
          <p className='cell-subtitle'>Keep going!</p>
        </Cell>
        <Cell className='cell cell-8'>
          <h1 className='cell-heading'>Your Daily Kick in the Butt</h1>
          <FaArrowTrendUp className='cell-icon relative-effort' />
          <p className='cell-main quote'>
            “I think if you exercise, your state of mind - my state of mind - is
            usually more at ease, ready for more mental challenges. Once I get
            the physical stuff out of the way it always seems like I have more
            calmness and better self-esteem.”
          </p>
          <p className='cell-subtitle quote-subtitle'>- Stone Gossard</p>
        </Cell>
      </section>
    </section>
  );
};

export default Dashboard;
