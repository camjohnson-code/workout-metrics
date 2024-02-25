import './Heatmap.css';
import Sidebar from '../Sidebar/Sidebar';

const Heatmap = ({ year, athlete }) => {
  return (
    <section className='heatmap'>
        <Sidebar athlete={athlete} year={year}></Sidebar>
      <h1>Heatmap</h1>
    </section>
  );
};

export default Heatmap;