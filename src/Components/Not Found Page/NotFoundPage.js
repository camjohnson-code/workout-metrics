import './NotFoundPage.css'
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className='not-found-page'>
      <h1 className='not-found-title'>Page not found!</h1>
      <p className='not-found-subtitle'>Click <Link className='not-found-link' to='/dashboard' >here</Link> to return to the dashboard.</p>
    </section>
  );
}

export default NotFoundPage;