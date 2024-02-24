import './Charts.css';
import Sidebar from '../Sidebar/Sidebar';

const Charts = ({ year }) => {
  return (
    <section className='charts'>
      <Sidebar year={year}>
        <h1>Charts</h1>
      </Sidebar>
    </section>
  );
};

export default Charts;
