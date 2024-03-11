import { useState, useEffect } from 'react';
import './LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import {
  getAthleteData,
  getAthleteActivities,
  addActivitiesToAPI,
  getActivitiesFromAPI,
} from '../../ApiCalls';
import Lottie from 'lottie-react';
import LoadingAnimation from '../../Animations/loading.json';

const LoadingPage = ({
  setAthlete,
  athlete,
  setRecentActivity,
  setActivities,
  getStreak,
  getLongestYearActivity,
  isLoggedIn,
  login,
  isAuthorized,
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    await getAthleteData().then((data) => {
      setAthlete(data);
    });
    await getAthleteActivities().then(async (activities) => {
      await addNewActivities(activities);
      setActivities(activities);
      getStreak(activities);
      getLongestYearActivity(activities);
      if (activities.length) setRecentActivity(activities[0]);
      else setRecentActivity({
        distance: 0,
        moving_time: 0,
        type: '',
        id: 0,
      });
    });

    login();
    setLoading(false);
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!isLoggedIn && isAuthorized) fetchData();
    else navigate('/dashboard');
  }, []);
  

  const addNewActivities = async (activities) => {
    const updatedActivities = activities;

    const oldActivitiesResponse = await getActivitiesFromAPI(athlete.id);
    const oldActivities = oldActivitiesResponse.data;

    const newActivities = updatedActivities.filter(
      (updatedActivity) =>
        !oldActivities.some(
          (oldActivity) => oldActivity.id === updatedActivity.id
        )
    );

    if (newActivities.length) await addActivitiesToAPI(newActivities);
  }

  return (
    <section className='loading-page'>
      {loading && (
        <Lottie
          animationData={LoadingAnimation}
          style={{ width: 300, height: 300 }}
        />
      )}
    </section>
  );
};

export default LoadingPage;
