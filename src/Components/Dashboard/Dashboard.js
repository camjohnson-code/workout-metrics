import './Dashboard.css';
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const Dashboard = ({ year }) => {
  return (
    <section className='dashboard'>
      <Sidebar year={year}></Sidebar>
    </section>
  );
};

export default Dashboard;
