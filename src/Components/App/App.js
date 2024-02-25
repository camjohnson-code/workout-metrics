import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import polyline from '@mapbox/polyline';
import LandingPage from '../Landing Page/LandingPage';
import LoadingPage from '../Loading Page/LoadingPage';
import Dashboard from '../Dashboard/Dashboard';
import Charts from '../Charts/Charts';
import Stats from '../Stats/Stats';
import Heatmap from '../Heatmap/Heatmap';
import HallOfFame from '../Hall Of Fame/HallOfFame';
import AddWorkout from '../Add Workout/AddWorkout';
import {
  getWeather,
  getQuote,
  fetchQuote,
  addQuoteToAPI,
} from '../../ApiCalls';

const App = () => {
  const year = new Date().getFullYear();

  const [athlete, setAthlete] = useState({});
  const [recentActivity, setRecentActivity] = useState({});
  const [activities, setActivities] = useState([]);
  const [achievementsYTD, setAchievementsYTD] = useState(0);
  const [homeCoordinates, setHomeCoordinates] = useState([]);
  const [longestYearActivity, setLongestYearActivity] = useState({});
  const [streak, setStreak] = useState(null);
  const [weather, setWeather] = useState(null);
  const [quote, setQuote] = useState({});
  const [effortUp, setEffortUp] = useState('same');
  const [lineLayer, setLineLayer] = useState(null);

  useEffect(() => {
    setAchievementsYTD(numAchievementsYTD);
    analyzeRelativeEffort(activities);
  }, [activities]);

  useEffect(() => {
    if (longestYearActivity.map) getPolylines();
  }, [longestYearActivity]);

  useEffect(() => {
    if (homeCoordinates.length)
      getWeather(homeCoordinates).then((weather) => setWeather(weather));
  }, [homeCoordinates]);

  useEffect(() => {
    fetchCoordinates();
    checkQuote();
  }, []);

  const numAchievementsYTD = activities
    .filter(
      (activity) => activity.start_date_local.slice(0, 4) === year.toString()
    )
    .reduce((acc, activity) => acc + activity.achievement_count, 0);

  const getPolylines = () => {
    const encryptedPolyline = longestYearActivity.map.summary_polyline;
    const decryptedPolyline = polyline.decode(encryptedPolyline);
    const flippedLngLat = decryptedPolyline.map(([lat, lng]) => [lng, lat]);

    setLineLayerCoordinates(flippedLngLat);
  };

  const setLineLayerCoordinates = (coordinatesArray) => {
    const output = coordinatesArray.map((coordinates, index) => {
      if (coordinatesArray[index + 1]) {
        return {
          sourcePosition: coordinates,
          targetPosition: coordinatesArray[index + 1],
        };
      }
    });

    setLineLayer(output.slice(0, -1));
  };

  const analyzeRelativeEffort = (activities) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(oneWeekAgo);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

    const filterActivities = (start, end) =>
      activities.filter((activity) => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= start && activityDate < end;
      });

    const reduceMovingTime = (filteredActivities) =>
      filteredActivities.reduce(
        (total, activity) => total + activity.moving_time,
        0
      );

    const activitiesLastWeek = filterActivities(oneWeekAgo, new Date());
    const activitiesWeekBefore = filterActivities(twoWeeksAgo, oneWeekAgo);

    const movingTimeLastWeek = reduceMovingTime(activitiesLastWeek);
    const movingTimeWeekBefore = reduceMovingTime(activitiesWeekBefore);

    if (movingTimeLastWeek > movingTimeWeekBefore) setEffortUp('up');
    else if (movingTimeLastWeek < movingTimeWeekBefore) setEffortUp('down');
    else setEffortUp('same');
  };

  const checkQuote = async () => {
    getQuote().then((quote) => {
      if (!quote.quote) {
        if (quote.date === new Date().toLocaleDateString()) setQuote(quote[0]);
        else
          fetchQuote(
            'https://api.api-ninjas.com/v1/quotes?category=fitness'
          ).then((quote) => {
            addQuoteToAPI(quote[0]);
            checkQuote();
          });
      } else setQuote(quote);
    });
  };

  const getStreak = (data) => {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let streak = 0;

    for (let i = 0; i < data.length; i++) {
      let startDate = new Date(data[i].start_date);
      startDate.setHours(0, 0, 0, 0);

      if (+startDate === +date) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else if (+startDate < +date) break;
    }

    setStreak(streak);
  };

  const fetchCoordinates = async () => {
    const coordinates = await getCoordinates(
      `${athlete.city}`,
      `${athlete.state}`
    );

    setHomeCoordinates(coordinates);
  };

  const getLongestYearActivity = async (allActivities) => {
    const longestActivity = allActivities
      .filter(
        (activity) => activity.start_date_local.slice(0, 4) === year.toString()
      )
      .sort((a, b) => b.moving_time - a.moving_time)[0];

    setLongestYearActivity(longestActivity);
  };

  const convertMtoYds = (meters) => {
    return Math.round((meters * 1.09361).toFixed(2));
  };

  const convertMtoMiles = (meters) => {
    return (meters * 0.000621371).toFixed(2);
  };

  const getCoordinates = async (city, state) => {
    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    const query = `${city}, ${state}`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const { center } = data.features[0];
        return center;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage year={year} />} />
        <Route
          path='/redirect'
          element={
            <LoadingPage
              getPolylines={getPolylines}
              getStreak={getStreak}
              setActivities={setActivities}
              setAthlete={setAthlete}
              setRecentActivity={setRecentActivity}
              getLongestYearActivity={getLongestYearActivity}
            />
          }
        />
        <Route
          path='/dashboard'
          element={
            <Dashboard
              convertMtoMiles={convertMtoMiles}
              lineLayer={lineLayer}
              effortUp={effortUp}
              quote={quote}
              weather={weather}
              streak={streak}
              longestYearActivity={longestYearActivity}
              achievements={achievementsYTD}
              getCoordinates={getCoordinates}
              activities={activities}
              convertMtoYds={convertMtoYds}
              recentActivity={recentActivity}
              athlete={athlete}
              year={year}
            />
          }
        />
        <Route
          path='/charts'
          element={<Charts athlete={athlete} year={year} />}
        />
        <Route
          path='/stats'
          element={<Stats athlete={athlete} year={year} />}
        />
        <Route
          path='/heatmap'
          element={
            <Heatmap
              athlete={athlete}
              homeCoordinates={homeCoordinates}
              year={year}
            />
          }
        />
        <Route
          path='/hall-of-fame'
          element={<HallOfFame athlete={athlete} year={year} />}
        />
        <Route
          path='/add-workout'
          element={<AddWorkout athlete={athlete} year={year} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
