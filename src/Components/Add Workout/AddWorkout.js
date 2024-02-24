import './AddWorkout.css';
import Sidebar from '../Sidebar/Sidebar';

const AddWorkout = ({ year }) => {
  return (
    <section className='add-workout'>
        <Sidebar year={year}></Sidebar>
      <h1>Add Workout</h1>
    </section>
  );
};

export default AddWorkout;
