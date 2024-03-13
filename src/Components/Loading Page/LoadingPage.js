import { useState, useEffect } from 'react';
import './LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import {
  getAthleteFromStrava,
  getAthleteActivitiesFromStrava,
  postActivityToAPI,
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
  let numActivities;
  const [loading, setLoading] = useState(true);
  const [addingToDb, setAddingToDb] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
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
          numActivities = newActivities.length;
          setAddingToDb(true);
          newActivities.forEach(async (activity) => {
            await postActivityToAPI(activity);
            setUploadCount((prevCount) => prevCount + 1);
          });
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
      {!addingToDb ? <p>Getting your activities from Strava</p> : <p>{`Saving your activities ${numActivities ? Math.round(uploadCount / numActivities * 100) : 0}%`}</p>}
    </section>
  );
};

export default LoadingPage;
