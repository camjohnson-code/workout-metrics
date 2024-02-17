import './HeroSection.css';
import { FaChevronDown } from 'react-icons/fa6';
import { Link } from 'react-scroll';

const HeroSection = () => {
  return (
    <section className='hero-section' id='home'>
      <h1 className='title'>WorkoutMetrics.fit</h1>
      <p className='subtitle'>Empower your training with insightful metrics.</p>
      <img
        className='strava-connect-btn'
        src={require('../../Images/btn_strava_connectwith_orange@2x.png')}
        alt='Strava Connect Button'
      />
      <Link to='features' smooth={true} duration={1000}>
        <FaChevronDown className='down-icon' />
      </Link>
    </section>
  );
};

export default HeroSection;
