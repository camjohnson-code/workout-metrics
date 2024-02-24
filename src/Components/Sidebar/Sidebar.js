import './Sidebar.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import { FaFire, FaMedal, FaPlus } from 'react-icons/fa';
import { FaChartSimple, FaArrowTrendUp } from 'react-icons/fa6';
import { TbLogout2 } from 'react-icons/tb';

const Sidebar = ({ year }) => {
  return (
    <section className='sidebar'>
      <section className='sidebar-header'>
        <h1 className='user-name'>Cameron Johnson</h1>
      </section>
      <section className='sidebar-links'>
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
      </section>
      <footer className='sidebar-footer'>
        <NavLink to='/' className='sidebar-link footer-link'>
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
