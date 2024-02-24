import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../Landing Page/LandingPage';
import LoadingPage from '../Loading Page/LoadingPage';
import Dashboard from '../Dashboard/Dashboard';
import Charts from '../Charts/Charts';
import Stats from '../Stats/Stats';
import Heatmap from '../Heatmap/Heatmap';
import HallOfFame from '../Hall Of Fame/HallOfFame';
import AddWorkout from '../Add Workout/AddWorkout';

const App = () => {
  const year = new Date().getFullYear();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage year={year} />} />
        <Route path='/redirect' element={<LoadingPage />} />
        <Route path='/dashboard' element={<Dashboard year={year} />} />
        <Route path='/charts' element={<Charts year={year} />} />
        <Route path='/stats' element={<Stats year={year} />} />
        <Route path='/heatmap' element={<Heatmap year={year} />} />
        <Route path='/hall-of-fame' element={<HallOfFame year={year} />} />
        <Route path='/add-workout' element={<AddWorkout year={year} />} />
      </Routes>
    </Router>
  );
};

export default App;
