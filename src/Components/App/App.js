import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter as Router
import LandingPage from '../Landing Page/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
