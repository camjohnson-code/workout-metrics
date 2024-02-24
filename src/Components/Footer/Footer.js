import './Footer.css';

const Footer = ({year}) => {
  return (
    <footer className='footer'>
      <p>{`© Cameron Johnson, ${year}.`}</p>
      <img
        className='strava-power-btn'
        src={require('../../Images/api_logo_pwrdBy_strava_horiz_white.png')}
        alt='Powered by Strava'
      />
    </footer>
  );
};

export default Footer;
