import './Sidebar.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IoMdHome, IoIosRefresh, IoMdSettings } from 'react-icons/io';
import { FaFire, FaMedal, FaPlus } from 'react-icons/fa';
import { FaArrowTrendUp, FaChartSimple } from 'react-icons/fa6';
import { TbLogout2 } from 'react-icons/tb';
import PropTypes from 'prop-types';

const Sidebar = ({
  year,
  athlete,
  logout,
  setSettingsShown,
  settingsShown,
}) => {
  const handleRefresh = () => {
    console.log('clicked');
  };

  const handleSettings = () => {
    setSettingsShown(!settingsShown);
  };

  return (
    <section className='sidebar'>
      <Link
        target='#'
        to={`https://www.strava.com/athletes/${athlete?.id}`}
        className='sidebar-header'
      >
        <img src={`${athlete?.profile}`} className='profile-photo' />
        <h1 className='user-name'>
          {athlete?.firstname} {athlete?.lastname}
        </h1>
      </Link>
      <nav className='sidebar-links'>
        <NavLink to='/dashboard' className='sidebar-link'>
          <IoMdHome className='sidebar-icon' /> Overview
        </NavLink>
        <NavLink to='/charts' className='sidebar-link'>
          <FaChartSimple className='sidebar-icon' />
          Charts
        </NavLink>
        <NavLink to='/stats' className='sidebar-link'>
          <FaArrowTrendUp className='sidebar-icon' /> Stats
        </NavLink>
        <NavLink to='/heatmap' className='sidebar-link'>
          <FaFire className='sidebar-icon' /> Heatmap
        </NavLink>
        <NavLink to='/hall-of-fame' className='sidebar-link'>
          <FaMedal className='sidebar-icon' /> Hall of Fame
        </NavLink>
        <NavLink to='/add-workout' className='sidebar-link'>
          <FaPlus className='sidebar-icon' /> Add Workout
        </NavLink>
        <button onClick={handleRefresh} className='sidebar-button sidebar-link'>
          <IoIosRefresh className='sidebar-icon' /> Refresh Data
        </button>
        <button onClick={handleSettings} className='sidebar-button sidebar-link'>
          <IoMdSettings className='sidebar-icon' /> Settings
        </button>
      </nav>
      <footer className='sidebar-footer'>
        <NavLink
          onClick={() => logout()}
          to='/'
          className='sidebar-link footer-link'
        >
          <TbLogout2 className='sidebar-icon' />
          Sign Out
        </NavLink>
        <img
          className='sidebar-strava-power-btn'
          src={require('../../Images/api_logo_pwrdBy_strava_horiz_white.png')}
          alt='Powered by Strava'
        />
        <p className='sidebar-copyright'>© {year} Cameron Johnson</p>
      </footer>
    </section>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  year: PropTypes.number.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profile: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
  }).isRequired,
};
