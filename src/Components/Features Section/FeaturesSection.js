import './FeaturesSection.css';
import { FaCheckCircle } from 'react-icons/fa';

const FeaturesSection = () => {
  return (
    <section className='features' id='features'>
      <section className='features-images'>
        <img className='img-1' src={require('../../Images/chart.png')} />
        <img
          className='img-2'
          src={require('../../Images/shahadat-rahman-BfrQnKBulYQ-unsplash.jpg')}
        />
        <img className='img-3' src={require('../../Images/heatmap.png')} />
      </section>
      <section className='features-text'>
        <h2 className='feature-heading'>
          Unique tools for all your data visualization
        </h2>
        <p className='feature-subtitle'>
          Use our tools to track your data at a glance. Then share your
          achievements easily.
        </p>
        <ul>
          <li>
            <FaCheckCircle className='check' />
            <p>
              <span className='bold-text'>Heatmaps</span> - See where you’ve
              traveled
            </p>
          </li>
          <li>
            <FaCheckCircle className='check' />
            <p>
              <span className='bold-text'>Charts</span> - Your stats, visualized
            </p>
          </li>
          <li>
            <FaCheckCircle className='check' />
            <p>
              <span className='bold-text'>Easy share</span> - Showcase your
              achievements easily
            </p>
          </li>
        </ul>
      </section>
    </section>
  );
};

export default FeaturesSection;
