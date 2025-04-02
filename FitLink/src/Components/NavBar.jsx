import { FaHome, FaCalendarAlt, FaUserFriends, FaCog, FaUserCircle } from 'react-icons/fa';

const NavBar = () => {
  return (
    <div className="h-screen w-16 bg-black flex flex-col items-center justify-between py-6">
      <div className="flex flex-col items-center gap-8">
        <FaHome className="text-white text-2xl cursor-pointer" />
        <FaCalendarAlt className="text-white text-2xl cursor-pointer" />
        <FaUserFriends className="text-white text-2xl cursor-pointer" />
        <FaCog className="text-white text-2xl cursor-pointer" />
      </div>
      <div className="mb-4">
        <FaUserCircle className="text-white text-3xl cursor-pointer" />
      </div>
    </div>
  );
};

export default NavBar;
