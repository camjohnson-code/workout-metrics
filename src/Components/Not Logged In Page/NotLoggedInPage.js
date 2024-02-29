import './NotLoggedInPage.css';
import { Link } from 'react-router-dom';

const NotLoggedInPage = () => {
  return (
    <section className='not-logged-in-page'>
      <h1 className='not-logged-in-title'>Please Sign In</h1>
      <p className='not-logged-in-text'>
        You must return to the home page and{' '}
        <Link className='must-sign-in-link' to='/'>
          sign in
        </Link>{' '}
        to view this page.
      </p>
    </section>
  );
};

export default NotLoggedInPage;
