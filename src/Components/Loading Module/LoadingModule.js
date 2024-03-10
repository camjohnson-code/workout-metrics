import Lottie from 'lottie-react';
import LoadingAnimation from '../../Animations/loading.json';
import './LoadingModule.css';

const LoadingModule = () => {
  return (
    <section className='loading-page loading-module'>
      <Lottie
        animationData={LoadingAnimation}
        style={{ width: 300, height: 300 }}
      />
    </section>
  );
};

export default LoadingModule;
