import './NotFoundPage.css';
import { Link } from 'react-router-dom';

const NotFoundPage = ({ isLoggedIn }) => {
  return (
    <section className='not-found-page'>
      <h1 className='not-found-title'>Page not found!</h1>
      <p className='not-found-subtitle'>
        Click{' '}
        <Link className='not-found-link' to={isLoggedIn ? '/dashboard' : '/'}>
          here
        </Link>{' '}
        to return {isLoggedIn ? 'to the dashboard' : 'home'}.
      </p>
    </section>
  );
};

export default NotFoundPage;
