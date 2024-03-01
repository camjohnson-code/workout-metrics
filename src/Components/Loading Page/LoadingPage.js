import { useState, useEffect } from 'react';
import './LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import {
  handleAuthorizationCallback,
  getAthleteData,
  getAthleteActivities,
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
    await getAthleteActivities().then((activities) => {
      setActivities(activities);
      setRecentActivity(activities[0]);
      getStreak(activities);
      getLongestYearActivity(activities);
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
