import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import AddClient from './Components/AddClient';
import NavBar from './Components/NavBar';
import HomePage from './Pages/HomePage';
import ProgramPage from './Pages/ProgramPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/ProgramPage" element={<ProgramPage />} />
        <Route path="/AddClient" element={<AddClient />} />
        <Route path="/NavBar" element={<NavBar />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;