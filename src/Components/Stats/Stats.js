import './Stats.css';
import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import LoadingModule from '../Loading Module/LoadingModule';
import SettingsModule from '../Settings Module/SettingsModule';
import { Link } from 'react-router-dom';
import { CiShare1 } from 'react-icons/ci';
import { FaChartSimple } from 'react-icons/fa6';
import {
  FaTrophy,
  FaFighterJet,
  FaRunning,
  FaSwimmer,
  FaFire,
  FaMountain,
  FaThumbsUp,
} from 'react-icons/fa';
import { MdDirectionsBike } from 'react-icons/md';
import { IoMdStopwatch } from 'react-icons/io';
import { LuBanana, LuActivity } from 'react-icons/lu';
import polyline from '@mapbox/polyline';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import PropTypes from 'prop-types';
import {
  getUserFromAPI,
  refreshAccessToken,
  addAthleteToAPI,
  getAthleteActivities,
} from '../../ApiCalls';

const Stats = ({
  options,
  activities,
  year,
  athlete,
  logout,
  isLoading,
  setIsLoading,
  selectedUnit,
  setSelectedUnit,
  selectedTheme,
  setSelectedTheme,
  settingsShown,
  setSettingsShown,
}) => {
  const [numActivities, setNumActivities] = useState(activities.length);
  const [numAchievements, setNumAchievements] = useState(0);
  const [selectedYear, setSelectedYear] = useState('all-time');
  const [favoriteActivityType, setFavoriteActivityType] = useState(null);
  const [favoriteActivityTypeCount, setFavoriteActivityTypeCount] = useState(0);
  const [secondMostFrequentActivityType, setSecondMostFrequentActivityType] =
    useState(null);
  const [
    secondMostFrequentActivityTypeCount,
    setSecondMostFrequentActivityTypeCount,
  ] = useState(0);
  const [longestActivity, setLongestActivity] = useState({});
  const [lineLayer, setLineLayer] = useState([]);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [distance, setDistance] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [mtEverests, setMtEverests] = useState(0);
  const [kudos, setKudos] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [maxSpeedActivityId, setMaxSpeedActivityId] = useState('');

  useEffect(() => {
    // const refreshActivityData = async () => {
    //   setIsLoading(true);
    //   const user = await getUserFromAPI(athlete.id);
    //   if (user.data.tokenExpiration >= String(Date.now())) {
    //     setIsLoading(false);
    //   } else {
    //     const newAccessToken = await refreshAccessToken(
    //       user.data.stravaRefreshToken
    //     );
    //     await addAthleteToAPI(
    //       user.data,
    //       newAccessToken.access_token,
    //       user.data.stravaRefreshToken,
    //       newAccessToken.expires_at
    //     );
    //     await getAthleteActivities();
    //     setIsLoading(false);
    //   }
    // };
    // refreshActivityData();
  }, []);

  useEffect(() => {
    calcNumAchievements();
  }, [activities]);

  useEffect(() => {
    calcNumActivities();
    calcNumAchievements();
    getFavoriteActivityTypes(activities);
    setLineLayerCoordinates();
    calcCaloriesBurned();
    calcDistance();
    calcElevationGain();
    calcKudos();
    getMaxSpeed();
  }, [selectedYear]);

  useEffect(() => {
    calcMtEverests();
  }, [elevationGain]);

  const Cell = ({ className, children }) => {
    return <section className={className}>{children}</section>;
  };

  const calcNumActivities = () => {
    let activityCount;

    if (selectedYear === 'all-time') {
      activityCount = activities.length;
      setNumActivities(activityCount);
    } else {
      activityCount = activities.filter(
        (activity) =>
          activity.start_date.slice(0, 4) === selectedYear.toString()
      ).length;

      setNumActivities(activityCount);
    }
  };

  const calcNumAchievements = () => {
    let achievementCount;

    if (selectedYear === 'all-time') {
      achievementCount = activities.reduce(
        (acc, activity) => acc + activity.achievement_count,
        0
      );

      setNumAchievements(achievementCount);
    } else {
      achievementCount = activities
        .filter(
          (activity) =>
            activity.start_date.slice(0, 4) === selectedYear.toString()
        )
        .reduce((acc, activity) => acc + activity.achievement_count, 0);

      setNumAchievements(achievementCount);
    }
  };

  const getFavoriteActivityTypes = (activities) => {
    if (activities.length) {
      let activitiesByNumber;

      if (selectedYear === 'all-time') {
        activitiesByNumber = activities.reduce((acc, activity) => {
          if (acc[activity?.type]) acc[activity?.type]++;
          else acc[activity?.type] = 1;

          return acc;
        }, {});
      } else {
        activitiesByNumber = activities
          .filter(
            (activity) =>
              activity.start_date.slice(0, 4) === selectedYear.toString()
          )
          .reduce((acc, activity) => {
            if (acc[activity?.type]) acc[activity?.type]++;
            else acc[activity?.type] = 1;

            return acc;
          }, {});
      }

      let entries = Object.entries(activitiesByNumber);
      entries.sort((a, b) => b[1] - a[1]);

      setFavoriteActivityType(entries[0][0]);
      setFavoriteActivityTypeCount(entries[0][1]);
      setSecondMostFrequentActivityType(entries[1] ? entries[1][0] : null);
      setSecondMostFrequentActivityTypeCount(entries[1] ? entries[1][1] : null);
    }
  };

  const determineActivityUnits = (activityType) => {
    if (activityType === 'Ride') return 'rides';
    else if (activityType === 'Run') return 'runs';
    else if (activityType === 'Swim') return 'swims';
    else return 'activities';
  };

  const determineActivityType = (activityType) => {
    if (activityType === 'Ride') return 'cycling';
    else if (activityType === 'VirtualRide') return 'indoor cycling';
    else if (activityType === 'Run') return 'running';
    else if (activityType === 'Swim') return 'swimming';
    else if (activityType === 'WeightTraining') return 'weight lifting';
    else if (activityType === 'Hike') return 'hiking';
    else if (activityType === 'Snowboard') return 'snowboarding';
    else if (activityType === 'Ski') return 'skiing';
    else if (activityType === 'walk') return 'walking';
    else if (activityType === 'yoga') return 'yoga';
    else return 'working out';
  };

  const getLongestActivity = () => {
    let longestActivity;

    if (selectedYear === 'all-time')
      longestActivity = activities.sort(
        (a, b) => b.moving_time - a.moving_time
      )[0];
    else
      longestActivity = activities
        .filter(
          (workout) =>
            workout.start_date.slice(0, 4) === selectedYear.toString()
        )
        .sort((a, b) => b.moving_time - a.moving_time)[0];

    setLongestActivity(longestActivity);
    return longestActivity;
  };

  const getLongestActivityPolylines = (longestActivity) => {
    const encryptedPolyline = longestActivity?.map?.summary_polyline;
    const decryptedPolyline = polyline.decode(encryptedPolyline);
    const flippedLngLat = decryptedPolyline.map(([lat, lng]) => [lng, lat]);

    return flippedLngLat;
  };

  const setLineLayerCoordinates = () => {
    if (activities.length) {
      const coordinatesArray = getLongestActivityPolylines(
        getLongestActivity()
      );

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
    }
  };

  const layers = [
    new LineLayer({
      id: 'line-layer',
      data: lineLayer,
      getColor: () => [138, 169, 249],
      opacity: 1,
    }),
  ];

  const calcCaloriesBurned = () => {
    let caloriesBurned;

    if (selectedYear === 'all-time') {
      caloriesBurned = activities.reduce((acc, workout) => {
        if (workout.kilojoules) acc += workout.kilojoules / 4.184;
        else if (athlete.weight) {
          if (workout.type === 'Swim' || workout.type === 'Run')
            acc += 7 * athlete.weight * (workout.elapsed_time / 3600);
          else if (workout.type === 'WeightTraining')
            acc += 4.5 * athlete.weight * (workout.elapsed_time / 3600);
          else acc += 3 * athlete.weight * (workout.elapsed_time / 3600);
        } else {
          let met;
          if (workout.type === 'Swim') met = 10;
          else if (workout.type === 'Run') met = 9.8;
          else if (workout.type === 'WeightTraining') met = 3.5;
          else met = 2.5;

          const caloriesPerMinute = (met * 3.5 * 70) / 200;
          acc += caloriesPerMinute * (workout.elapsed_time / 60);
        }

        return acc;
      }, 0);

      setCaloriesBurned(Math.round(caloriesBurned));
    } else {
      caloriesBurned = activities
        .filter(
          (workout) =>
            workout.start_date.slice(0, 4) === selectedYear.toString()
        )
        .reduce((acc, workout) => {
          if (workout.kilojoules) acc += workout.kilojoules / 4.184;
          else if (athlete.weight) {
            if (workout.type === 'Swim' || workout.type === 'Run')
              acc += 7 * athlete.weight * (workout.elapsed_time / 3600);
            else if (workout.type === 'WeightTraining')
              acc += 4.5 * athlete.weight * (workout.elapsed_time / 3600);
            else acc += 3 * athlete.weight * (workout.elapsed_time / 3600);
          } else {
            let met;
            if (workout.type === 'Swim') met = 10;
            else if (workout.type === 'Run') met = 9.8;
            else if (workout.type === 'WeightTraining') met = 3.5;
            else met = 2.5;

            const caloriesPerMinute = (met * 3.5 * 70) / 200;
            acc += caloriesPerMinute * (workout.elapsed_time / 60);
          }

          return acc;
        }, 0);

      setCaloriesBurned(Math.round(caloriesBurned));
    }
  };

  const calcElevationGain = () => {
    let elevationInMeters;

    if (selectedYear === 'all-time')
      elevationInMeters = activities
        .reduce((acc, workout) => acc + workout.total_elevation_gain, 0);
    else
      elevationInMeters = activities
        .filter((workout) => workout.start_date.slice(0, 4) === selectedYear.toString())
        .reduce((acc, workout) => acc + workout.total_elevation_gain, 0);

    const elevationInFeet = elevationInMeters * 3.28084;

    selectedUnit === 'Imperial' ? setElevationGain(Math.round(elevationInFeet)) : setElevationGain(Math.round(elevationInMeters));
  };

  const calcMtEverests = () => {
    const numMtEverests = elevationGain / 29029;

    setMtEverests(numMtEverests.toFixed(1));
  };

  const calcDistance = () => {
    let distanceInMeters;

    if (selectedYear === 'all-time')
      distanceInMeters = activities
        .reduce((acc, workout) => acc + workout.distance, 0);
    else
      distanceInMeters = activities
        .filter((workout) => workout.start_date.slice(0, 4) === selectedYear.toString())
        .reduce((acc, workout) => acc + workout.distance, 0);

    const distanceInMiles = distanceInMeters * 0.000621371;

    selectedUnit === 'Imperial' ? setDistance(Math.round(distanceInMiles)) : setDistance(Math.round(distanceInMeters));
  };

  const calcKudos = () => {
    let kudos;

    if (selectedYear === 'all-time')
      kudos = activities.reduce((acc, workout) => acc + workout.kudos_count, 0);
    else
      kudos = activities
        .filter(
          (workout) =>
            workout.start_date.slice(0, 4) === selectedYear.toString()
        )
        .reduce((acc, workout) => acc + workout.kudos_count, 0);

    setKudos(kudos);
  };

  const getMaxSpeed = () => {
    let maxSpeedActivity;

    if (activities.length) {
      if (selectedYear === 'all-time')
        maxSpeedActivity = activities
          .sort((a, b) => b.max_speed - a.max_speed)[0];
      else
        maxSpeedActivity = activities
          .filter((workout) => workout.start_date.slice(0, 4) === selectedYear.toString())
          .sort((a, b) => b.max_speed - a.max_speed)[0];

      const maxSpeedInMetersPerSecond = maxSpeedActivity.max_speed;
      const maxSpeedInKph = (maxSpeedInMetersPerSecond * 3.6).toFixed(1);
      const maxSpeedInMph = (maxSpeedInMetersPerSecond * 2.23694).toFixed(1);

      selectedUnit === 'Imperial' ? setMaxSpeed(maxSpeedInMph) : setMaxSpeed(maxSpeedInKph);
      setMaxSpeedActivityId(maxSpeedActivity.id);
    }
  };

  const INITIAL_VIEW_STATE =
    lineLayer && lineLayer?.length
      ? {
          longitude:
            lineLayer[Math.round(lineLayer.length / 2)].sourcePosition[0],
          latitude:
            lineLayer[Math.round(lineLayer.length / 2)].sourcePosition[1],
          zoom: 10,
          pitch: 0,
          bearing: 0,
        }
      : {};

  return (
    <section className='stats-page'>
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
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
      />
      <Sidebar
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        athlete={athlete}
        year={year}
      ></Sidebar>
      <section className='stats-container'>
        <div className='stats-header'>
          <label className='filter-title'>Filter:</label>
          <select
            className='year-select'
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value='all-time'>All Time</option>
            {options}
          </select>
        </div>
        <section className='stats-section'>
          <Cell className='cell stats-cell-1'>
            <h1 className='cell-heading'>Activities</h1>
            <FaChartSimple className='cell-icon activities' />
            <p className='cell-main'>{numActivities.toLocaleString()}</p>
            <p className='cell-subtitle'>
              {numActivities
                ? 'Keep it up!'
                : "Today's a great day to get started"}
            </p>
          </Cell>
          <Cell className='cell stats-cell-2'>
            <h1 className='cell-heading'>Achievements</h1>
            <FaTrophy className='cell-icon achievements' />
            <p className='cell-main'>
              {Number(numAchievements).toLocaleString()}
            </p>
            <p className='cell-subtitle'>
              {numAchievements ? 'Turning sweat into virtual gold' : ''}
            </p>
          </Cell>
          <Cell className='cell stats-cell-3'>
            <h1 className='cell-heading'>Favorite Activity Type</h1>
            {favoriteActivityType === 'Ride' ? (
              <MdDirectionsBike className='cell-icon fav-activity' />
            ) : favoriteActivityType === 'Run' ? (
              <FaRunning className='cell-icon fav-activity' />
            ) : favoriteActivityType === 'Swim' ? (
              <FaSwimmer className='cell-icon fav-activity' />
            ) : (
              <LuActivity className='cell-icon fav-activity' />
            )}
            {favoriteActivityType ? (
              <p className='cell-main'>
                {favoriteActivityType} | {favoriteActivityTypeCount}{' '}
                <span className='unit'>
                  {determineActivityUnits(favoriteActivityType)}
                </span>
              </p>
            ) : (
              <p>No activities</p>
            )}
            {!favoriteActivityType ? (
              <p></p>
            ) : secondMostFrequentActivityType ? (
              <p className='cell-subtitle'>
                {`That's ${(
                  favoriteActivityTypeCount /
                  secondMostFrequentActivityTypeCount
                ).toFixed(1)}x 
              more than your next favorite activity—${determineActivityType(
                secondMostFrequentActivityType
              )}!`}
              </p>
            ) : (
              <p className='cell-subtitle'>You're a one-trick pony!</p>
            )}
          </Cell>
          <Cell className='cell stats-cell-4'>
            <h1 className='cell-heading'>Longest Activity</h1>
            <IoMdStopwatch className='cell-icon longest-activity-stat' />
            {longestActivity.moving_time ? (
              <p className='cell-main'>
                {Math.floor(longestActivity.moving_time / 3600)}
                <span className='unit'>hr</span>{' '}
                {Math.floor((longestActivity.moving_time % 3600) / 60)}
                <span className='unit'>min</span>
              </p>
            ) : (
              <p></p>
            )}

            <div className='deckgl-container'>
              {longestActivity?.map?.summary_polyline ? (
                <DeckGL
                  initialViewState={INITIAL_VIEW_STATE}
                  controller={true}
                  layers={layers}
                >
                  <Map
                    mapboxAccessToken={
                      process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
                    }
                    mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                    attributionControl={false}
                  />
                </DeckGL>
              ) : (
                <p className='cell-main'>
                  Your longest activity had no gps data!
                </p>
              )}
            </div>
            {longestActivity?.map?.summary_polyline && (
              <Link
                target='#'
                to={`https://www.strava.com/activities/${longestActivity.id}`}
                className='cell-subtitle view-link'
              >
                View on Strava <CiShare1 className='view-icon' />
              </Link>
            )}
          </Cell>
          <Cell className='cell stats-cell-5'>
            <h1 className='cell-heading'>Calories Burned</h1>
            <FaFire className='cell-icon calories' />
            <p className='cell-main'>
              {caloriesBurned.toLocaleString()}
              <span className='unit'>kcal</span>
            </p>
            <p className='cell-subtitle'>{`That's ${Math.round(
              Number(caloriesBurned) / 285
            )} slices of pizza`}</p>
          </Cell>
          <Cell className='cell stats-cell-6'>
            <h1 className='cell-heading'>Distance</h1>
            <LuBanana className='cell-icon banana' />
            <p className='cell-main'>
              {distance.toLocaleString()}
              <span className='unit'>mi</span>
            </p>
            <p className='cell-subtitle'>{`That's about ${Math.round(
              (distance * 63360) / 7
            ).toLocaleString()} bananas`}</p>
          </Cell>
          <Cell className='cell stats-cell-7'>
            <h1 className='cell-heading'>Elevation Gain</h1>
            <FaMountain className='cell-icon elevation-gain' />
            <p className='cell-main'>
              {elevationGain.toLocaleString()}
              <span className='unit'>ft</span>
            </p>
            <p className='cell-subtitle'>{`That's about ${mtEverests} Mt. Everests`}</p>
          </Cell>
          <Cell className='cell stats-cell-8'>
            <h1 className='cell-heading'>Kudos Received</h1>
            <FaThumbsUp className='cell-icon kudos' />
            <p className='cell-main'>
              {kudos.toLocaleString()}
              <span className='unit'>kudos</span>
            </p>
            <p className='cell-subtitle'>
              {kudos ? 'Way to inspire others!' : ''}
            </p>
          </Cell>
          <Cell className='cell stats-cell-9'>
            <h1 className='cell-heading'>Max Speed</h1>
            <FaFighterJet className='cell-icon max-speed' />
            {maxSpeed ? (
              <p className='cell-main'>
                {maxSpeed}
                <span className='unit'>mph</span>
              </p>
            ) : (
              <p className='cell-main'>No GPS data</p>
            )}
            {maxSpeed !== 0 && (
              <Link
                target='#'
                to={`https://www.strava.com/activities/${maxSpeedActivityId}`}
                className='cell-subtitle view-link'
              >
                View on Strava <CiShare1 className='view-icon' />
              </Link>
            )}
          </Cell>
        </section>
      </section>
    </section>
  );
};

export default Stats;

Stats.propTypes = {
  options: PropTypes.arrayOf(PropTypes.element).isRequired,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      achievement_count: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      start_date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      moving_time: PropTypes.number.isRequired,
      map: PropTypes.shape({
        summary_polyline: PropTypes.string,
      }),
      kilojoules: PropTypes.number,
      total_elevation_gain: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
      kudos_count: PropTypes.number.isRequired,
      max_speed: PropTypes.number.isRequired,
    })
  ).isRequired,
  year: PropTypes.number.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    city: PropTypes.string,
    state: PropTypes.string,
    username: PropTypes.string,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string,
    profile: PropTypes.string.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};
