import { useState, useEffect } from 'react';
import './LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import {
  getAthleteData,
  getAthleteActivities,
  addActivitiesToAPI,
} from '../../ApiCalls';
import Lottie from 'lottie-react';
import LoadingAnimation from '../../Animations/loading.json';

const LoadingPage = ({
  setAthlete,
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
      await addActivitiesToAPI(activities);
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
