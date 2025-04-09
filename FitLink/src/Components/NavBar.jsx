import { FaHome, FaCalendarAlt, FaUserFriends, FaSignOutAlt, FaUserCircle, FaRegEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SignOutConfirm from '../Components/SignOutConfirm';
import React, { useState } from "react";


const NavBar = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/SignIn");
    setShowConfirmation(false);
  }

  return (
    <div className="h-screen w-25 bg-black flex flex-col items-center justify-between py-6">
      <div className="flex flex-col items-center gap-8">
        <Link to="/Home">
          <FaHome className="text-white text-4xl cursor-pointer" />
        </Link>
        <FaCalendarAlt className="text-white text-4xl cursor-pointer" />
        <Link to="/Clients">
          <FaUserFriends className="text-white text-4xl cursor-pointer" />
        </Link>

        <Link to="/Notes">
          <FaRegEdit className="text-white text-4xl cursor-pointer" />
        </Link>
      </div>
      <div className="mb-4">
        <Link to="/EditProfile">
          <FaUserCircle className="text-white text-4xl cursor-pointer mb-6" />
        </Link>

        <FaSignOutAlt className="text-white text-4xl cursor-pointer" onClick={() => setShowConfirmation(true)} />
        {showConfirmation && (
          <SignOutConfirm
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleSignOut}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
