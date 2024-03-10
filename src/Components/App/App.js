import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import polyline from '@mapbox/polyline';
import LandingPage from '../Landing Page/LandingPage';
import RedirectPage from '../Redirect Page/RedirectPage';
import LoadingPage from '../Loading Page/LoadingPage';
import Dashboard from '../Dashboard/Dashboard';
import ContactForm from '../Contact Form/ContactForm';
import Charts from '../Charts/Charts';
import Stats from '../Stats/Stats';
import Heatmap from '../Heatmap/Heatmap';
import HallOfFame from '../Hall Of Fame/HallOfFame';
import AddWorkout from '../Add Workout/AddWorkout';
import NotFoundPage from '../Not Found Page/NotFoundPage';
import {
  getWeather,
  getQuote,
  fetchQuote,
  addQuoteToAPI,
} from '../../ApiCalls';
import NotLoggedInPage from '../Not Logged In Page/NotLoggedInPage';

const App = () => {
  const year = new Date().getFullYear();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsShown, setSettingsShown] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('Imperial');
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [athlete, setAthlete] = useState(() => {
    const savedAthlete = localStorage.getItem('athlete');
    return savedAthlete
      ? JSON.parse(savedAthlete)
      : {
          id: 0,
          firstname: '',
          lastname: '',
          city: '',
          state: '',
          country: '',
          profile: '',
        };
  });

  const [recentActivity, setRecentActivity] = useState(() => {
    const savedRecentActivity = localStorage.getItem('recentActivity');
    return savedRecentActivity
      ? JSON.parse(savedRecentActivity)
      : {
          distance: 0,
          moving_time: 0,
          type: '',
          id: 0,
        };
  });

  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  const [achievementsYTD, setAchievementsYTD] = useState(() => {
    const savedAchievementsYTD = localStorage.getItem('achievementsYTD');
    return savedAchievementsYTD ? JSON.parse(savedAchievementsYTD) : 0;
  });

  const [homeCoordinates, setHomeCoordinates] = useState(() => {
    const savedHomeCoordinates = localStorage.getItem('homeCoordinates');
    return savedHomeCoordinates ? JSON.parse(savedHomeCoordinates) : [];
  });

  const [longestYearActivity, setLongestYearActivity] = useState(() => {
    const savedLongestYearActivity = localStorage.getItem(
      'longestYearActivity'
    );
    return savedLongestYearActivity
      ? JSON.parse(savedLongestYearActivity)
      : {
          distance: 0,
          id: 0,
          start_latlng: [],
        };
  });

  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('streak');
    return savedStreak ? JSON.parse(savedStreak) : 0;
  });

  const [weather, setWeather] = useState(() => {
    const savedWeather = localStorage.getItem('weather');
    return savedWeather ? JSON.parse(savedWeather) : { temp: 0 };
  });
  const [quote, setQuote] = useState(() => {
    const savedQuote = localStorage.getItem('quote');
    return savedQuote ? JSON.parse(savedQuote) : { quote: '', author: '' };
  });

  const [effortUp, setEffortUp] = useState(() => {
    const savedEffortUp = localStorage.getItem('effortUp');
    return savedEffortUp ? savedEffortUp : 'same';
  });

  const [lineLayer, setLineLayer] = useState(() => {
    const savedLineLayer = localStorage.getItem('lineLayer');
    return savedLineLayer
      ? JSON.parse(savedLineLayer)
      : [{ sourcePosition: [0, 0], targetPosition: [0, 0] }];
  });

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
    setAchievementsYTD(numAchievementsYTD);
    analyzeRelativeEffort(activities);
    if (activities.length) {
      const sortedActivities = activities.sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date)
      );
      setRecentActivity(sortedActivities[0]);
    }
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
  }, [recentActivity]);

  useEffect(() => {
    localStorage.setItem(
      'longestYearActivity',
      JSON.stringify(longestYearActivity)
    );
    if (longestYearActivity?.map) getPolylines();
  }, [longestYearActivity]);

  useEffect(() => {
    if (homeCoordinates.length)
      getWeather(homeCoordinates).then((weather) => setWeather(weather));
  }, [homeCoordinates]);

  useEffect(() => {
    localStorage.setItem('athlete', JSON.stringify(athlete));
    fetchCoordinates();
  }, [athlete]);

  useEffect(() => {
    localStorage.setItem('achievementsYTD', JSON.stringify(achievementsYTD));
  }, [achievementsYTD]);

  useEffect(() => {
    localStorage.setItem('homeCoordinates', JSON.stringify(homeCoordinates));
  }, [homeCoordinates]);

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('weather', JSON.stringify(weather));
  }, [weather]);

  useEffect(() => {
    localStorage.setItem('quote', JSON.stringify(quote));
  }, [quote]);

  useEffect(() => {
    localStorage.setItem('effortUp', effortUp);
  }, [effortUp]);

  useEffect(() => {
    const persistedLoginState = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(persistedLoginState === 'true');
    checkQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem('lineLayer', JSON.stringify(lineLayer));
  }, [lineLayer]);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAuthorized(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAuthorized');
  };

  const authenticate = () => {
    setIsAuthorized(true);
    localStorage.setItem('isAuthorized', 'true');
  };

  const numAchievementsYTD = activities
    .filter(
      (activity) => activity?.start_date_local?.slice(0, 4) === year.toString()
    )
    .reduce((acc, activity) => acc + activity?.achievement_count, 0);

  const getPolylines = () => {
    const encryptedPolyline = longestYearActivity?.map?.summary_polyline;
    const decryptedPolyline = polyline.decode(encryptedPolyline);
    const flippedLngLat = decryptedPolyline.map(([lat, lng]) => [lng, lat]);

    setLineLayerCoordinates(flippedLngLat);
  };

  const setLineLayerCoordinates = (coordinatesArray) => {
    const output = coordinatesArray.reduce((acc, coordinates, index) => {
      if (coordinatesArray[index + 1]) {
        acc.push({
          sourcePosition: coordinates,
          targetPosition: coordinatesArray[index + 1],
        });
      }
      return acc;
    }, []);

    setLineLayer(output);
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
    const quote = await getQuote();
    const today = new Date().toISOString().split('T')[0];

    if (quote?.date) {
      const quoteDate = new Date(quote.date);

      if (
        !isNaN(quoteDate.getTime()) &&
        quoteDate.toISOString().split('T')[0] === today
      )
        setQuote(quote);
      else {
        const newQuote = await fetchQuote(
          'https://api.api-ninjas.com/v1/quotes?category=fitness'
        );
        await addQuoteToAPI(newQuote[0]);
        setQuote(newQuote[0]);
      }
    } else {
      const newQuote = await fetchQuote(
        'https://api.api-ninjas.com/v1/quotes?category=fitness'
      );
      await addQuoteToAPI(newQuote[0]);
      setQuote(newQuote[0]);
    }
  };

  const getStreak = (data) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;

    data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    for (let i = 0; i < data.length; i++) {
      let startDate = new Date(data[i].start_date);
      startDate.setHours(0, 0, 0, 0);

      if (
        +startDate === +today ||
        +startDate === +new Date(today.setDate(today.getDate() - 1))
      )
        streak++;
      else if (+startDate < +today) break;
    }

    setStreak(streak);
  };

  const fetchCoordinates = async () => {
    const coordinates = await getCoordinates(
      `${athlete?.city}`,
      `${athlete?.state}`
    );

    setHomeCoordinates(coordinates);
  };

  const getLongestYearActivity = async (allActivities) => {
    const defaultActivity = {
      distance: 0,
      id: 0,
      start_latlng: [],
    };
    const longestActivity = allActivities
      .filter(
        (activity) => activity?.start_date_local.slice(0, 4) === year.toString()
      )
      .sort((a, b) => b?.moving_time - a?.moving_time)[0];

    allActivities.length
      ? setLongestYearActivity(longestActivity)
      : setLongestYearActivity(defaultActivity);
  };

  const formatDate = (dateString) => {
    let formattedDate;
    const date = new Date(dateString);
    selectedUnit === 'Imperial'
      ? (formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }))
      : (formattedDate = date.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }));

    return formattedDate;
  };

  const convertMtoYds = (meters) => {
    return Math.round((meters * 1.09361).toFixed(2));
  };

  const convertMtoMiles = (meters) => {
    return (meters * 0.000621371).toFixed(2);
  };

  const convertSecondsToHMS = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return hours
      ? `${hours}h ${minutes}m ${remainingSeconds}s`
      : `${minutes}m ${remainingSeconds}s`;
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

      if (data?.features && data?.features?.length > 0) {
        const { center } = data?.features[0];
        return center;
      } else return [0, 0];
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return;
    }
  };

  let years = [
    ...new Set(activities.map((activity) => activity?.start_date.slice(0, 4))),
  ].sort((a, b) => b - a);

  const options = years.map((year) => (
    <option value={year} key={year}>
      {year}
    </option>
  ));

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage year={year} />} />
        <Route
          path='/redirect'
          element={
            <RedirectPage
              setIsAuthorized={setIsAuthorized}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path='/loading'
          element={
            <LoadingPage
              setAthlete={setAthlete}
              setRecentActivity={setRecentActivity}
              setActivities={setActivities}
              getStreak={getStreak}
              getLongestYearActivity={getLongestYearActivity}
              isLoggedIn={isLoggedIn}
              isAuthorized={isAuthorized}
              login={login}
            />
          }
        />
        <Route
          path='/dashboard'
          element={
            isLoggedIn ? (
              <Dashboard
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                settingsShown={settingsShown}
                setSettingsShown={setSettingsShown}
                setActivities={setActivities}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
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
                logout={logout}
              />
            ) : (
              <NotLoggedInPage />
            )
          }
        />
        <Route
          path='/charts'
          element={
            isLoggedIn ? (
              <Charts
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                settingsShown={settingsShown}
                setSettingsShown={setSettingsShown}
                setActivities={setActivities}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                activities={activities}
                options={options}
                athlete={athlete}
                year={year}
                logout={logout}
              />
            ) : (
              <NotLoggedInPage />
            )
          }
        />
        <Route
          path='/stats'
          element={
            isLoggedIn ? (
              <Stats
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                settingsShown={settingsShown}
                setSettingsShown={setSettingsShown}
                setActivities={setActivities}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                options={options}
                activities={activities}
                logout={logout}
                athlete={athlete}
                year={year}
              />
            ) : (
              <NotLoggedInPage />
            )
          }
        />
        <Route
          path='/heatmap'
          element={
            isLoggedIn ? (
              <Heatmap
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                settingsShown={settingsShown}
                setSettingsShown={setSettingsShown}
                setActivities={setActivities}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                activities={activities}
                athlete={athlete}
                homeCoordinates={homeCoordinates}
                year={year}
                logout={logout}
              />
            ) : (
              <NotLoggedInPage />
            )
          }
        />
        <Route
          path='/hall-of-fame'
          element={
            isLoggedIn ? (
              <HallOfFame
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                settingsShown={settingsShown}
                setSettingsShown={setSettingsShown}
                setActivities={setActivities}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                formatDate={formatDate}
                convertSecondsToHMS={convertSecondsToHMS}
                convertMtoMiles={convertMtoMiles}
                athlete={athlete}
                year={year}
                logout={logout}
              />
            ) : (
              <NotLoggedInPage />
            )
          }
        />
        <Route
          path='/add-workout'
          element={
            isLoggedIn ? (
              <AddWorkout
                isLoading={isLoading}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                settingsShown={settingsShown}
                setSettingsShown={setSettingsShown}
                setActivities={setActivities}
                athlete={athlete}
                year={year}
                logout={logout}
              />
            ) : (
              <NotLoggedInPage />
            )
          }
        />
        <Route path='/contact' element={<ContactForm year={year} />} />
        <Route path='*' element={<NotFoundPage isLoggedIn={isLoggedIn} />} />
      </Routes>
    </Router>
  );
};

export default App;
