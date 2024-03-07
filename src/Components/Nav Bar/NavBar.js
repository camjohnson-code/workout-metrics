import './NavBar.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdHome } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { FaFire, FaMedal, FaPlus } from 'react-icons/fa';
import { FaArrowTrendUp, FaChartSimple } from "react-icons/fa6";
import { TbLogout2 } from 'react-icons/tb';
import { AnimatePresence, motion } from 'framer-motion';

const NavBar = ({ logout }) => {
  const [open, setOpen] = useState(false);

  return (
    <section className='mobile-nav'>
      <section className={`navbar ${open ? 'open' : ''}`}>
        <GiHamburgerMenu
          onClick={() => setOpen((prevOpen) => !prevOpen)}
          className={`hamburger-icon ${!open ? '' : 'hidden'}`}
        />
        <IoCloseSharp
          onClick={() => setOpen((prevOpen) => !prevOpen)}
          className={`hamburger-icon ${open ? '' : 'hidden'}`}
        />
      </section>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ y: '-100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '-100vh' }}
            transition={{ duration: 0.5, ease: [0.17, 0.59, 0.24, 0.99] }}
            className='nav-section'
          >
            <ul className='mobile-nav-links'>
              <li>
                <NavLink
                  to='/dashboard'
                  className='mobile-nav-link'
                  activeClassName='active'
                >
                  <IoMdHome className='sidebar-icon' /> Overview
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/dashboard'
                  className='mobile-nav-link'
                  activeClassName='active'
                >
                  <FaChartSimple className='sidebar-icon' /> Charts
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/dashboard'
                  className='mobile-nav-link'
                  activeClassName='active'
                >
                  <FaArrowTrendUp className='sidebar-icon' /> Stats
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/heatmap'
                  className='mobile-nav-link'
                  activeClassName='active'
                >
                  <FaFire className='sidebar-icon' /> Heatmap
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/hall-of-fame'
                  className='mobile-nav-link'
                  activeClassName='active'
                >
                  <FaMedal className='sidebar-icon' /> Hall of Fame
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/add-workout'
                  className='mobile-nav-link'
                  activeClassName='active'
                >
                  <FaPlus className='sidebar-icon' />
                  Add Workout
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => logout()}
                  to='/'
                  className='mobile-nav-link'
                  activeClassName='active'
                >
                  <TbLogout2 className='sidebar-icon' /> Sign Out
                </NavLink>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NavBar;
