import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../Landing Page/LandingPage';
import LoadingPage from '../Loading Page/LoadingPage';
import Dashboard from '../Dashboard/Dashboard';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/redirect' element={<LoadingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
