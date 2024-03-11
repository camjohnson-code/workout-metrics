import './FeaturesSection.css';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section className='features' id='features'>
      <section ref={ref} className='features-images'>
        <motion.img
          className='img-1'
          src={require('../../Images/charts.png')}
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -200 }}
          transition={{ duration: 1, ease: [0.17, 0.59, 0.24, 0.99], delay: 0.2 }}
          alt='Data chart preview'
        />
        <motion.img
          className='img-2'
          src={require('../../Images/hall-of-fame.png')}
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -200 }}
          transition={{
            duration: 1,
            ease: [0.17, 0.59, 0.24, 0.99],
            delay: 0.1,
          }}
          alt='Stock photo of computer code'
        />
        <motion.img
          className='img-3'
          src={require('../../Images/heatmap.png')}
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -200 }}
          transition={{
            duration: 1,
            ease: [0.17, 0.59, 0.24, 0.99],
          }}
          alt='Heatmaps preview'
        />
      </section>
      <section ref={ref} className='features-text'>
        <motion.h2
          className='feature-heading'
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 200 }}
          transition={{ duration: 1, ease: [0.17, 0.59, 0.24, 0.99] }}
        >
          Unique tools for all your data visualization
        </motion.h2>
        <motion.p
          className='feature-subtitle'
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 200 }}
          transition={{
            duration: 1,
            ease: [0.17, 0.59, 0.24, 0.99],
            delay: 0.1,
          }}
        >
          Use our tools to track your data at a glance. Then share your
          achievements easily.
        </motion.p>
        <ul>
          <motion.li
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 200 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.2,
            }}
          >
            <FaCheckCircle className='check' />
            <p>
              <span className='bold-text'>Heatmaps</span> - See where you’ve
              traveled
            </p>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 200 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.3,
            }}
          >
            <FaCheckCircle className='check' />
            <p>
              <span className='bold-text'>Charts</span> - Your stats, visualized
            </p>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 200 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.59, 0.24, 0.99],
              delay: 0.4,
            }}
          >
            <FaCheckCircle className='check' />
            <p>
              <span className='bold-text'>Hall of Fame</span> - Favorite activities you're proud of
            </p>
          </motion.li>
        </ul>
      </section>
    </section>
  );
};

export default FeaturesSection;
