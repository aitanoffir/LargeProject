// HomePage.jsx
import { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';
import { FaDumbbell, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
  
    if (urlToken) {
      try {
        // Save the token to localStorage
        localStorage.setItem("token", urlToken);
  
        // Decode the payload to get user info
        const [header, payload, signature] = urlToken.split('.');
        const decodedPayload = JSON.parse(atob(payload));
  
        localStorage.setItem("userId", decodedPayload.id || decodedPayload._id);
        localStorage.setItem("verified", "true");
  
        if (decodedPayload.name) {
          setUserEmail(decodedPayload.name);
        }
  
        // Clean up the URL by removing the token param
        const cleanUrl = window.location.origin + "/Home";
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (error) {
        console.error("Error decoding token from URL:", error);
        navigate('/signin');
      }
    } else {
      // No token in URL — use token from localStorage
      const token = localStorage.getItem('token');
      const verified = localStorage.getItem('verified');
  
      if (verified === "false") {
        navigate("/email-verify");
      }
  
      if (token) {
        try {
          const [header, payload, signature] = token.split('.');
          const decodedPayload = JSON.parse(atob(payload));
          const email = decodedPayload.name;
  
          if (email) {
            setUserEmail(email);
          }
        } catch (error) {
          console.error("Error decoding local token:", error);
          navigate('/signin');
        }
      } else {
        console.log("No token found in localStorage");
        navigate('/signin');
      }
    }
  }, [navigate]);
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* NavBar on the left */}
      <NavBar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header section */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome back, <span className="text-purple-600">{userEmail || 'User'}</span>
            </h1>
            <p className="text-gray-600">Your dashboard overview</p>
          </div>
        </header>

        {/* Main content with navigation boxes */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Workouts box */}
            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => navigate("/ProgramPage")} //replace later with page route
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FaDumbbell size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">My Workouts</h2>
                  <p className="text-gray-600">Create and manage your workout plans</p>
                </div>
              </div>
            </div>

            {/* View My Clients box */}
            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => navigate("/Clients")} //replace later with page route
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">View My Clients</h2>
                  <p className="text-gray-600">Manage your client list and profiles</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
