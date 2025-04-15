import {
  FaHome,
  FaCalendarAlt,
  FaUserFriends,
  FaSignOutAlt,
  FaUserCircle,
  FaRegEdit
} from 'react-icons/fa';
import { FaDumbbell } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import SignOutConfirm from '../Components/SignOutConfirm';
import React, { useState } from "react";

const NavBar = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("verified");

    navigate("/SignIn");
    setShowConfirmation(false);
  }

  return (
    <div className="h-screen w-15 md:w-25 bg-black flex flex-col items-center justify-between py-6 md:py-6">
      <div className="flex flex-col items-center gap-8 md:gap-8">
        <Link to="/Home">
          <FaHome className="text-white text-4xl cursor-pointer" />
        </Link>
        <Link to="/Calendar">
          <FaCalendarAlt className="text-white text-4xl cursor-pointer" />
        </Link>
        <Link to="/Clients">
          <FaUserFriends className="text-white text-4xl cursor-pointer" />
        </Link>
        <Link to="/MyProgram">
          <FaDumbbell className="text-white text-4xl cursor-pointer" />
        </Link>
      </div>
      <div className="mb-2 md:mb-4">
        <Link to="/EditProfile">
          <FaUserCircle className="text-white text-4xl cursor-pointer mb-6" />
        </Link>
        <FaSignOutAlt
          className="text-white text-4xl cursor-pointer"
          onClick={() => setShowConfirmation(true)}
        />
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
