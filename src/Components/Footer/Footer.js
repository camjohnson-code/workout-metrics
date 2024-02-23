import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='footer'>
      <p>{`© Cameron Johnson, ${year}.`}</p>
      <img
        className='strava-power-btn'
        src={require('../../Images/api_logo_pwrdBy_strava_horiz_white.png')}
        alt='Strava Connect Button'
      />
    </footer>
  );
};

export default Footer;
