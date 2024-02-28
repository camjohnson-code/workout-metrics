import { useState } from 'react';
import './Card.css';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CiShare1 } from 'react-icons/ci';
import PropTypes from 'prop-types';

const Card = ({
  activity,
  convertMtoMiles,
  convertSecondsToHMS,
  formatDate,
  onStarClick,
  isFavorite,
}) => {
  const [isStarred, setIsStarred] = useState(false);

  const handleStarClick = () => {
    setIsStarred(!isStarred);
    if (!isStarred) onStarClick();
  };

  return (
    <article className='card'>
      {isFavorite ? (
        <FaStar className='star-icon' onClick={handleStarClick} />
      ) : (
        <CiStar className='star-icon' onClick={handleStarClick} />
      )}
      <h1 className='card-title'>{activity.name}</h1>
      <section className='card-info-section'>
        <p className='card-info'>{activity.type}</p>
        <p className='card-info'>{formatDate(activity.start_date)}</p>
        <p className='card-info'>{convertMtoMiles(activity.distance)} miles</p>
        <p className='card-info'>{convertSecondsToHMS(activity.time)}</p>
        <p className='card-info'>
          <Link
            className='view-link'
            target='#'
            to={`https://www.strava.com/activities/${activity.id}`}
          >
            View on Strava
          </Link>
          <CiShare1 className='view-icon' />
        </p>
      </section>
    </article>
  );
};

export default Card;

Card.propTypes = {
  activity: PropTypes.shape({
    distance: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  convertMtoMiles: PropTypes.func.isRequired,
  convertSecondsToHMS: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  onStarClick: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};
