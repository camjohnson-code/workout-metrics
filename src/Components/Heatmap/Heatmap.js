import './Heatmap.css';
import Sidebar from '../Sidebar/Sidebar';

const Heatmap = ({ year }) => {
  return (
    <section className='heatmap'>
        <Sidebar year={year}></Sidebar>
      <h1>Heatmap</h1>
    </section>
  );
};

export default Heatmap;
