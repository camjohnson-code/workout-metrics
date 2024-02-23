import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../Landing Page/LandingPage';
import LoadingPage from '../Loading Page/LoadingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/redirect' element={<LoadingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
