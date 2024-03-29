import './HallOfFame.css';
import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import NavBar from '../Nav Bar/NavBar';
import LoadingModule from '../Loading Module/LoadingModule';
import SettingsModule from '../Settings Module/SettingsModule';
import Card from '../Card/Card';
import {
  getFilteredActivitiesFromAPI,
  postFavoriteToHallOfFame,
  deleteFavoriteFromHallOfFame,
  getHallOfFameActivities,
} from '../../ApiCalls';
import PropTypes from 'prop-types';

const HallOfFame = ({
  year,
  athlete,
  convertMtoMiles,
  convertSecondsToHMS,
  formatDate,
  logout,
  isLoading,
  selectedUnit,
  setSelectedUnit,
  selectedTheme,
  setSelectedTheme,
  settingsShown,
  setSettingsShown,
  setRefreshData,
  refreshData,
}) => {
  const [favorites, setFavorites] = useState([]);
  const [activities, setActivities] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const isValidForm = !keywords;

  useEffect(() => {
    getHallOfFameActivities(athlete).then((favorites) =>{
      if (favorites) setFavorites(favorites)
    }
    );
  }, [athlete, refreshData]);

  useEffect(() => {
    setActivities([]);
    setHasSearched(false);
  }, [keywords]);

  const handleFormSubmit = (event) => {
    if (
      event.type === 'submit' ||
      (event.type === 'keydown' && event.key === 'Enter')
    ) {
      event.preventDefault();
      setHasSearched(true);
      const fetchData = async () => {
        const activities = await getFilteredActivitiesFromAPI(
          athlete,
          keywords,
          activityType
        );

        setActivities(activities);
      };

      fetchData();
    }
  };

  const handleStarClick = async (activity) => {
    const isFavorite = favorites.some(
      (favorite) => favorite?.id === activity?.id
    );
    if (isFavorite) {
      setFavorites(favorites.filter((favorite) => favorite.id !== activity.id));
      setActivities(activities.filter((act) => act.id !== activity.id));
      try {
        await deleteFavoriteFromHallOfFame(activity.id);
      } catch (error) {
        console.error('Error removing favorite from Hall of Fame:', error);
      }
    } else {
      setFavorites([...favorites, activity]);
      try {
        await postFavoriteToHallOfFame(activity);
      } catch (error) {
        console.error('Error adding favorite to Hall of Fame:', error);
      }
    }
  };
  const cards = activities.map((activity) => {
    const isFavorite = favorites.some(
      (favorite) => favorite?.id === activity?.id
    );

    return (
      <Card
        selectedUnit={selectedUnit}
        selectedTheme={selectedTheme}
        formatDate={formatDate}
        convertSecondsToHMS={convertSecondsToHMS}
        convertMtoMiles={convertMtoMiles}
        activity={activity}
        key={activity?.id}
        onStarClick={() => handleStarClick(activity)}
        isFavorite={isFavorite}
      />
    );
  });

  const favoriteCards = favorites.map((activity) => {
    return (
      <Card
        selectedUnit={selectedUnit}
        selectedTheme={selectedTheme}
        formatDate={formatDate}
        convertSecondsToHMS={convertSecondsToHMS}
        convertMtoMiles={convertMtoMiles}
        activity={activity}
        key={activity?.id}
        onStarClick={() => handleStarClick(activity)}
        isFavorite={true}
      />
    );
  });

  return (
    <section className='hall-of-fame'>
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
        setRefreshData={setRefreshData}
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
      />
      <Sidebar
        setRefreshData={setRefreshData}
        selectedTheme={selectedTheme}
        settingsShown={settingsShown}
        setSettingsShown={setSettingsShown}
        logout={logout}
        athlete={athlete}
        year={year}
      ></Sidebar>
      <section className='hall-of-fame-section'>
        <h1 className='hall-of-fame-title'>
          {athlete?.firstname}'s Hall of Fame
        </h1>
        <form className='hall-of-fame-form' onSubmit={handleFormSubmit}>
          <section className='selector'>
            <label htmlFor='keywords'>Keywords:</label>
            <input
              type='text'
              id='keywords'
              name='keywords'
              placeholder='Search for activities'
              value={keywords}
              onKeyDown={(e) => {
                handleFormSubmit(e);
              }}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </section>
          <section className='selector'>
            <label htmlFor='activity-type'>Activity Type:</label>
            <select
              onChange={(e) => setActivityType(e.target.value)}
              value={activityType}
              name='activity-type'
              id='activity-type'
            >
              <option value='all'>All</option>
              <option value='run'>Run</option>
              <option value='ride'>Ride</option>
              <option value='swim'>Swim</option>
            </select>
          </section>
          <button
            disabled={isValidForm}
            type='submit'
            className='form-submit-button'
          >
            Search
          </button>
        </form>
        {!!favorites?.length && !keywords && (
          <section className='card-container'>{favoriteCards}</section>
        )}
        {!favorites?.length && !keywords && (
          <p className='search-text'>
            Save memorable activities using the form above.
          </p>
        )}
        {keywords && !hasSearched && (
          <p className='search-text'>Press submit to see your results.</p>
        )}
        {activities.length > 0 && keywords && (
          <section className='card-container'>{cards}</section>
        )}
        {!activities?.length && keywords && hasSearched && (
          <p className='search-text'>
            No activities found. Try your search again.
          </p>
        )}
      </section>
    </section>
  );
};

export default HallOfFame;

HallOfFame.propTypes = {
  year: PropTypes.number.isRequired,
  athlete: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstname: PropTypes.string.isRequired,
  }).isRequired,
  convertMtoMiles: PropTypes.func.isRequired,
  convertSecondsToHMS: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};
