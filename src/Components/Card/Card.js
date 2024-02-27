import { useState } from 'react';
import './Card.css';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CiShare1 } from 'react-icons/ci';

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
