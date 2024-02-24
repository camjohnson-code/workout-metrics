import './HallOfFame.css';
import Sidebar from '../Sidebar/Sidebar';

const HallOfFame = ({ year }) => {
  return (
    <section className='hall-of-fame'>
        <Sidebar year={year}></Sidebar>
      <h1>Hall of Fame</h1>
    </section>
  );
};

export default HallOfFame;
