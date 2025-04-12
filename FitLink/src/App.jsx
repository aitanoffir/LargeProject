import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import AddClient from './Components/AddClient';
import NavBar from './Components/NavBar';
import HomePage from './Pages/HomePage';
import ProgramPage from './Pages/ProgramPage';
import ClientsPage from './Pages/ClientsPage';
import Notes from './Pages/Notes';
import CreateNote from './Components/CreateNote';
import ViewNote from './Components/ViewNote';
import EditProfile from './Pages/EditProfile';
import EditProgram from './Components/Program/EditProgram';
import EmailVerifyPage from './Pages/EmailVerificationPage';
import PasswordResetPage from './Pages/PasswordResetPage';


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
        <Route path="/Clients" element={<ClientsPage />} />
        <Route path="/CreateNote" element={<CreateNote />} />
        <Route path="/MyProgram" element={<ProgramPage />} /> 
        <Route path="/Notes" element={<Notes />} />
        <Route path="/ViewNote/:id" element={<ViewNote />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Email-Verify" element={<EmailVerifyPage />} />
        <Route path="/Password-Reset" element={<PasswordResetPage />} />
        
        {/*dev work routes*/}
        <Route path="/test-edit-program" element={<EditProgram />} />
        
      </Routes>
    </Router>
  );
}

export default App;