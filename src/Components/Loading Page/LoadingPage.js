import { useState, useEffect } from 'react';
import './LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import {
  getAthleteFromStrava,
  getAthleteActivitiesFromStrava,
  postActivitiesToAPI,
  getUserActivitiesFromAPI,
  postAthleteToAPI,
  deleteActivitiesFromAPI,
} from '../../ApiCalls';
import Lottie from 'lottie-react';
import LoadingAnimation from '../../Animations/loading.json';
import Cookies from 'js-cookie';

const LoadingPage = ({
  setAthlete,
  setActivities,
  isLoggedIn,
  login,
  isAuthorized,
}) => {
  const [loading, setLoading] = useState(true);
  const [addingToDb, setAddingToDb] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && isAuthorized) fetchData();
    else navigate('/dashboard');
  }, []);

  const fetchData = async () => {
    await getAthleteFromStrava().then(async (stravaAthlete) => {
      await postAthleteToAPI(stravaAthlete);
      await setAthlete(stravaAthlete);
      await Cookies.set('userId', stravaAthlete.id, { expires: 60, path: '/' });
  
      await getAthleteActivitiesFromStrava().then(async (activities) => {
        const newActivities = await getNewActivities(activities, stravaAthlete);
        if (newActivities.length) {
          setAddingToDb(true);
          await postActivitiesToAPI(newActivities);
        }
        setActivities(activities);
      });
  
      login();
      setLoading(false);
      navigate('/dashboard');
    });
  };

  const getNewActivities = async (activities, stravaAthlete) => {
    const updatedActivities = activities;
    const oldActivities = await getUserActivitiesFromAPI(stravaAthlete.id); 

    const activitiesToDelete = oldActivities.filter(
      (oldActivity) => !updatedActivities.some((updatedActivity) => updatedActivity.id === oldActivity.id)
    );
    await Promise.all(activitiesToDelete.map(activity => deleteActivitiesFromAPI(activity.id)));

    const newActivities = updatedActivities.filter(
      (updatedActivity) => !oldActivities.some((oldActivity) => oldActivity.id === updatedActivity.id)
    );

    return newActivities;
  };
  
  
  

  return (
    <section className='loading-page'>
      {loading && (
        <Lottie
          animationData={LoadingAnimation}
          style={{ width: 300, height: 300 }}
        />
      )}
      {!addingToDb ? <p>Getting your activities from Strava</p> : <p>Saving your activities</p>}
    </section>
  );
};

export default LoadingPage;
