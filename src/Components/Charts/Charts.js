import './Charts.css';
import Sidebar from '../Sidebar/Sidebar';

const Charts = ({ year, athlete }) => {
  return (
    <section className='charts'>
      <Sidebar athlete={athlete} year={year}>
        <h1>Charts</h1>
      </Sidebar>
    </section>
  );
};

export default Charts;
