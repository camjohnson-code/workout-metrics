import './Stats.css';
import Sidebar from '../Sidebar/Sidebar';

const Stats = ({ year }) => {
  return (
    <section className='stats'>
        <Sidebar year={year}></Sidebar>
      <h1>Stats</h1>
    </section>
  );
}

export default Stats;