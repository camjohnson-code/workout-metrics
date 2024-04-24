import './HeroSection.css';
import { FaChevronDown } from 'react-icons/fa6';
import { Link } from 'react-scroll';
import { redirectToStravaAuthorization } from '../../ApiCalls';

const HeroSection = ({ canUseWebP }) => {
  return (
    <section
      className={`hero-section ${canUseWebP ? 'webp-bkg' : 'jpg-bkg'}`}
      id='home'
    >
      <h1 className='title'>WorkoutMetrics.fit</h1>
      <p className='subtitle'>Empower your training with insightful metrics.</p>
      <button
        className='button-holder'
        alt='Strava Connect Button'
        tabIndex={0}
        aria-label='Connect with Strava'
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            redirectToStravaAuthorization();
          }
        }}
        onClick={(event) => {
          redirectToStravaAuthorization();
        }}
      >
        <img
          className='strava-connect-btn'
          src={require('../../Images/btn_strava_connectwith_orange@2x.png')}
        />
      </button>
      <Link to='features' smooth={true} duration={1000}>
        <FaChevronDown
          className='down-icon'
          tabIndex={0}
          aria-label='Scroll to Features section'
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              const featuresElement = document.getElementById('features');
              featuresElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </Link>
    </section>
  );
};

export default HeroSection;
