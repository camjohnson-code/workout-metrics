import './HallOfFame.css';
import Sidebar from '../Sidebar/Sidebar';

const HallOfFame = ({ year, athlete }) => {
  return (
    <section className='hall-of-fame'>
        <Sidebar athlete={athlete} year={year}></Sidebar>
      <h1>Hall of Fame</h1>
    </section>
  );
};

export default HallOfFame;
