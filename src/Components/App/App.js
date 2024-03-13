import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
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
  getQuoteFromDB,
  getQuoteFromAPI,
  postQuoteToAPI,
  getAthleteFromAPI,
  refreshAccessToken,
  postActivityToAPI,
  getUserActivitiesFromAPI,
  updateAthleteInAPI,
  deleteActivitiesFromAPI,
  getAthleteActivitiesFromStrava,
  deleteQuoteFromAPI,
  getHallOfFameActivities,
  deleteFavoriteFromHallOfFame,
} from '../../ApiCalls';
import NotLoggedInPage from '../Not Logged In Page/NotLoggedInPage';
import '../../themes.css';

const App = () => {
  const year = new Date().getFullYear();
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('isLoggedIn'));
  const [isAuthorized, setIsAuthorized] = useState(
    !!Cookies.get('isAuthorized')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [settingsShown, setSettingsShown] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('Imperial');
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [athlete, setAthlete] = useState({
    id: 0,
    firstname: '',
    lastname: '',
    city: '',
    state: '',
    country: '',
    profile: '',
  });
  const [activities, setActivities] = useState([]);
  const [achievementsYTD, setAchievementsYTD] = useState(0);
  const [effortUp, setEffortUp] = useState('');
  const [recentActivity, setRecentActivity] = useState({
    distance: 0,
    moving_time: 0,
    type: '',
    id: 0,
  });
  const [longestYearActivity, setLongestYearActivity] = useState({
    distance: 0,
    id: 0,
    start_latlng: [],
  });
  const [lineLayer, setLineLayer] = useState([
    { sourcePosition: [0, 0], targetPosition: [0, 0] },
  ]);
  const [streak, setStreak] = useState(0);
  const [homeCoordinates, setHomeCoordinates] = useState([]);
  const [quote, setQuote] = useState({ quote: 'As we run, we become.', author: 'Amby Burfoot' });
  const [weather, setWeather] = useState({ temp: 0 });

  useEffect(() => {
    fetchUser();
    checkQuote();
    const fetchLineLayer = async () => {
      const activities = await getUserActivitiesFromAPI(athlete.id);
      const longestActivity = await getLongestYearActivity(activities);

      if (longestActivity && longestActivity.map && longestActivity.map.summary_polyline) {
        const polylines = await getPolylines(longestActivity);
        const lineLayerCoordinates = generateLineLayerCoordinates(polylines);
        setLineLayer(lineLayerCoordinates);
      }
    };

    fetchLineLayer();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    if (athlete.city && athlete.state) {
      fetchCoordinates().then((coordinates) => setHomeCoordinates(coordinates));
    }
  }, [athlete]);

  useEffect(() => {
    if (homeCoordinates.length)
      getWeather(homeCoordinates).then((weather) => setWeather(weather));
  }, [homeCoordinates]);

useEffect(() => {
  setAchievementsYTD(numAchievementsYTD);

  const effort = analyzeRelativeEffort(activities);
  setEffortUp(effort);

  if (activities.length) {
    const sortedActivities = activities.sort(
      (a, b) => new Date(b.start_date) - new Date(a.start_date)
    );
    setRecentActivity(sortedActivities[0]);
  }

  handleLongestActivity();

  const streak = getStreak(activities);
  setStreak(streak);

  if (activities.length) setRecentActivity(activities[0]);
  else
    setRecentActivity({
      distance: 0,
      moving_time: 0,
      type: '',
      id: 0,
    });
}, [activities, achievementsYTD]);

const handleLongestActivity = async () => {
  const longestActivity = await getLongestYearActivity(activities);
  setLongestYearActivity(longestActivity);

  if (longestActivity && longestActivity.map && longestActivity.map.summary_polyline) {
    const polylines = await getPolylines(longestActivity);
    const lineLayerCoordinates = generateLineLayerCoordinates(polylines);

    setLineLayer(lineLayerCoordinates);
  }
};

  const fetchAthleteFromDB = async (userId) => {
    try {
      const response = await getAthleteFromAPI(userId);
      return response.data;
    } catch (error) {
      console.error('Error fetching athlete data:', error);
      return null;
    }
  };

  const login = () => {
    setIsLoggedIn(true);
    Cookies.set('isLoggedIn', 'true', { expires: 60, path: '/' });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAuthorized(false);
    Cookies.remove('isLoggedIn');
    Cookies.remove('isAuthorized');
    Cookies.remove('userId');
  };

  const fetchUser = async () => {
    const userId = Cookies.get('userId');
    const isLoggedIn = Cookies.get('isLoggedIn');
    const isAuthorized = Cookies.get('isAuthorized');

    if (isLoggedIn && isAuthorized && userId) {
      const athleteData = await getAthleteFromAPI(userId);
      const activitiesData = await getUserActivitiesFromAPI(userId);
      if (athleteData) {
        setAthlete(athleteData);
        setActivities(activitiesData);
        setIsLoggedIn(true);
      } 
    }
  };

  const refreshActivityData = async () => {
    setIsLoading(true);
    const user = await getAthleteFromAPI(athlete.id);
    const newAccessToken = await refreshAccessToken(user?.stravaRefreshToken);

    athlete.stravaAccessToken = newAccessToken?.access_token;
    athlete.tokenExpiration = newAccessToken?.expires_at;
    await updateAthleteInAPI(athlete);

    const updatedActivities = await getAthleteActivitiesFromStrava(
      athlete.stravaAccessToken
    );
    const oldActivities = await getUserActivitiesFromAPI(athlete.id);
    const hallOfFameActivities = await getHallOfFameActivities(athlete);

    const apiActivitiesToDelete = oldActivities.filter(
      (oldActivity) =>
        !updatedActivities.some(
          (updatedActivity) => updatedActivity.id === oldActivity.id
        )
    );
    await Promise.all(
      apiActivitiesToDelete.map((activity) =>
        deleteActivitiesFromAPI(activity.id)
      )
    );

    const hallOfFameActivitiesToDelete = hallOfFameActivities.filter(
      (hallOfFameActivity) =>
        !updatedActivities.some(
          (updatedActivity) => updatedActivity.id === hallOfFameActivity.id
        )
    );
    await Promise.all(
      hallOfFameActivitiesToDelete.map((activity) =>
        deleteFavoriteFromHallOfFame(activity.id)
      )
    );

    const newActivities = updatedActivities.filter(
      (updatedActivity) =>
        !oldActivities.some(
          (oldActivity) => oldActivity.id === updatedActivity.id
        )
    );

    newActivities.forEach(async (activity) => {
      await postActivityToAPI(activity);
    });
    await setActivities(updatedActivities);
    setIsLoading(false);
    setRefreshData(false);
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

    return streak;
  };

  const numAchievementsYTD = activities
    .filter(
      (activity) => activity?.start_date_local?.slice(0, 4) === year.toString()
    )
    .reduce((acc, activity) => acc + activity?.achievement_count, 0);

  const getPolylines = (longestActivity) => {
    const encryptedPolyline = longestActivity?.map?.summary_polyline;
    const decryptedPolyline = polyline.decode(encryptedPolyline);
    const flippedLngLat = decryptedPolyline.map(([lat, lng]) => [lng, lat]);

    return flippedLngLat;
  };

  const generateLineLayerCoordinates = (coordinatesArray) => {
    const output = coordinatesArray.reduce((acc, coordinates, index) => {
      if (coordinatesArray[index + 1]) {
        acc.push({
          sourcePosition: coordinates,
          targetPosition: coordinatesArray[index + 1],
        });
      }
      return acc;
    }, []);

    return output;
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

    if (movingTimeLastWeek > movingTimeWeekBefore) return 'up';
    else if (movingTimeLastWeek < movingTimeWeekBefore) return 'down';
    else return 'same';
  };

  const checkQuote = async () => {
    const quote = await getQuoteFromDB();
    const today = new Date().toISOString().split('T')[0];

    if (quote?.date === today) setQuote(quote);
    else {
      const newQuote = await getQuoteFromAPI(
        'https://api.api-ninjas.com/v1/quotes?category=fitness'
      );
      const date = new Date().toISOString().split('T')[0];

      if (quote?._id) await deleteQuoteFromAPI(quote?._id);
      await postQuoteToAPI({ date: date, ...newQuote[0] });
      setQuote(newQuote[0]);
    }
  };

  const fetchCoordinates = async () => {
    const coordinates = await getCoordinates(
      `${athlete?.city}`,
      `${athlete?.state}`
    );

    return coordinates;
  };

  const getLongestYearActivity = async (allActivities) => {
    const defaultActivity = {
      distance: 0,
      id: 0,
      start_latlng: [],
    };

    const longestActivity = allActivities
      .filter((activity) => activity?.start_date.slice(0, 4) === year.toString())
      .sort((a, b) => b?.moving_time - a?.moving_time)[0];

    return allActivities.length ? longestActivity : defaultActivity;
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
              athlete={athlete}
              setAthlete={setAthlete}
              setRecentActivity={setRecentActivity}
              setStreak={setStreak}
              setActivities={setActivities}
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
                setRefreshData={setRefreshData}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                settingsShown={settingsShown}
                setSettingsShown={setSettingsShown}
                isLoading={isLoading}
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
                setRefreshData={setRefreshData}
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
                setRefreshData={setRefreshData}
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
                setRefreshData={setRefreshData}
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
                refreshData={refreshData}
                setRefreshData={setRefreshData}
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
                setRefreshData={setRefreshData}
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
