import { useEffect } from 'react';
import './LoadingPage.css';
import {
  handleAuthorizationCallback,
  getAthleteData,
  getAthleteActivities,
} from '../../ApiCalls';
import { useNavigate } from 'react-router-dom';

const LoadingPage = ({
  setAthlete,
  setRecentActivity,
  setActivities,
  getStreak,
  getLongestYearActivity,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await handleAuthorizationCallback();
    await getAthleteData().then((data) => {
      setAthlete(data);
    });
    await getAthleteActivities().then((activities) => {
      setActivities(activities);
      setRecentActivity(activities[0]);
      getStreak(activities);
      getLongestYearActivity(activities);
    });
    await navigate('/dashboard');
  };

  return null;
};

export default LoadingPage;
