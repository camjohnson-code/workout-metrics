import './Charts.css';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import LoadingModule from '../Loading Module/LoadingModule';
import SettingsModule from '../Settings Module/SettingsModule';
import { useEffect, useState } from 'react';
import LineChart from '../Line Chart/LineChart';
import PropTypes from 'prop-types';

const Charts = ({
  activities,
  options,
  year,
  athlete,
  logout,
  isLoading,
  selectedUnit,
  setSelectedUnit,
  selectedTheme,
  setSelectedTheme,
  settingsShown,
  setSettingsShown,
  setRefreshData,
}) => {
  const [selectedYear, setSelectedYear] = useState(year);
  const [durationData, setDurationData] = useState(null);
  const [cyclingData, setCyclingData] = useState(null);
  const [runningData, setRunningData] = useState(null);
  const [swimmingData, setSwimmingData] = useState(null);
  const [borderColor, setBorderColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);

  useEffect(() => {
    calcDurationData(activities);
    calcCyclingData(activities);
    calcRunningData(activities);
    calcSwimmingData(activities);
  }, [selectedYear, borderColor, backgroundColor]);

  useEffect(() => {
    if (selectedTheme === 'Dark') {
      setBorderColor('#8aa9f9');
      setBackgroundColor('rgba(138, 169, 249, 0.25)');
    } else {
      setBorderColor('#ff4600');
      setBackgroundColor('rgba(255, 70, 0, 0.25)');
    }
  }, [selectedTheme]);

  const calcDurationData = (data) => {
    const selectedYearNumber = Number(selectedYear);

    const activitiesPerWeek = Array.from({ length: 52 }, () => 0);

    data.forEach((activity) => {
      const date = new Date(activity.start_date);
      const year = date.getFullYear();

      if (year === selectedYearNumber) {
        const week = getWeekNumber(date);
        const movingTimeInHours = activity?.moving_time / 3600;

        activitiesPerWeek[week - 1] += movingTimeInHours;
      }
    });

    setDurationData({
      labels: makeLabels(),
      datasets: [
        {
          fill: true,
          data: activitiesPerWeek,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ],
    });
  };

  const calcCyclingData = (data) => {
    const selectedYearNumber = Number(selectedYear);

    const activitiesPerWeek = Array.from({ length: 52 }, () => 0);

    data.forEach((activity) => {
      const date = new Date(activity.start_date);
      const year = date.getFullYear();

      if (
        year === selectedYearNumber &&
        (activity?.type === 'Ride' || activity?.type === 'VirtualRide')
      ) {
        const week = getWeekNumber(date);
        const movingTimeInHours = activity?.moving_time / 3600;

        activitiesPerWeek[week - 1] += movingTimeInHours;
      }
    });

    setCyclingData({
      labels: makeLabels(),
      datasets: [
        {
          fill: true,
          data: activitiesPerWeek,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ],
    });
  };

  const calcRunningData = (data) => {
    const selectedYearNumber = Number(selectedYear);

    const activitiesPerWeek = Array.from({ length: 52 }, () => 0);

    data.forEach((activity) => {
      const date = new Date(activity?.start_date);
      const year = date.getFullYear();

      if (
        year === selectedYearNumber &&
        (activity?.type === 'Run' || activity?.type === 'TrailRun')
      ) {
        const week = getWeekNumber(date);
        const movingTimeInHours = activity?.moving_time / 3600;

        activitiesPerWeek[week - 1] += movingTimeInHours;
      }
    });

    setRunningData({
      labels: makeLabels(),
      datasets: [
        {
          fill: true,
          data: activitiesPerWeek,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ],
    });
  };

  const calcSwimmingData = (data) => {
    const selectedYearNumber = Number(selectedYear);

    const activitiesPerWeek = Array.from({ length: 52 }, () => 0);

    data.forEach((activity) => {
      const date = new Date(activity?.start_date);
      const year = date.getFullYear();

      if (year === selectedYearNumber && activity?.type === 'Swim') {
        let distance;
        const week = getWeekNumber(date);

        if (selectedUnit === 'Imperial')
          distance = Math.round(activity?.distance * 1.09361);
        else if (selectedUnit === 'Metric')
          distance = Math.round(activity?.distance);

        activitiesPerWeek[week - 1] += distance;
      }
    });

    setSwimmingData({
      labels: makeLabels(),
      datasets: [
        {
          fill: true,
          data: activitiesPerWeek,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ],
    });
  };

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  const makeLabels = () => {
    const labels = [];
    for (let i = 1; i < 53; i++) {
      labels.push(i);
    }
    return labels;
  };

  return (
    <section className='charts'>
      {isLoading && <LoadingModule />}
      {settingsShown && (
        <SettingsModule
          selectedUnit={selectedUnit}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          setSelectedUnit={setSelectedUnit}
          settingsShown={settingsShown}
          setSettingsShown={setSettingsShown}
        />
      )}
      <NavBar
        setRefreshData={setRefreshData}
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
      />
      <Sidebar
        setRefreshData={setRefreshData}
        selectedTheme={selectedTheme}
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        athlete={athlete}
        year={year}
        logout={logout}
      />
      <section className='charts-content'>
        <div className='stats-header'>
          <label className='filter-title'>Filter:</label>
          <select
            className='year-select'
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {options}
          </select>
        </div>
        <section className='all-charts'>
          <section className='chart'>
            <h1 className='chart-title'>Duration Per Month (hours)</h1>
            <div className='chart-container'>
              {durationData && <LineChart data={durationData} />}
            </div>
          </section>
          <section className='chart'>
            <h1 className='chart-title'>Cycling Duration Per Week (hours)</h1>
            <div className='chart-container'>
              {cyclingData && <LineChart data={cyclingData} />}
            </div>
          </section>
          <section className='chart'>
            <h1 className='chart-title'>Running Duration Per Week (hours)</h1>
            <div className='chart-container'>
              {runningData && <LineChart data={runningData} />}
            </div>
          </section>
          <section className='chart'>
            <h1 className='chart-title'>
              Swimming Distance Per Week (
              {selectedUnit === 'Imperial' ? 'yards' : 'meters'})
            </h1>
            <div className='chart-container'>
              {swimmingData && <LineChart data={swimmingData} />}
            </div>
          </section>
        </section>
      </section>
    </section>
  );
};

export default Charts;

Charts.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      start_date: PropTypes.string.isRequired,
      moving_time: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  options: PropTypes.arrayOf(PropTypes.element).isRequired,
  year: PropTypes.number.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string,
    state: PropTypes.string,
    profile: PropTypes.string.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};
