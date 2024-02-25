import './Stats.css';
import Sidebar from '../Sidebar/Sidebar';

const Stats = ({ year, athlete }) => {
  return (
    <section className='stats'>
        <Sidebar athlete={athlete} year={year}></Sidebar>
      <h1>Stats</h1>
    </section>
  );
}

export default Stats;