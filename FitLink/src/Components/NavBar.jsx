import { FaHome, FaCalendarAlt, FaUserFriends, FaCog, FaUserCircle, FaRegEdit } from 'react-icons/fa';

const NavBar = () => {
  return (
    <div className="h-screen w-25 bg-black flex flex-col items-center justify-between py-6">
      <div className="flex flex-col items-center gap-8">
        <FaHome className="text-white text-4xl cursor-pointer" onClick={() => navigate("/Home")} />
        <FaCalendarAlt className="text-white text-4xl cursor-pointer" />
        <FaUserFriends className="text-white text-4xl cursor-pointer" />
        <FaRegEdit className="text-white text-4xl cursor-pointer" onClick={() => navigate("/ProgramPage")} />
        <FaCog className="text-white text-4xl cursor-pointer" />
      </div>
      <div className="mb-4">
        <FaUserCircle className="text-white text-4xl cursor-pointer" />
      </div>
    </div>
  );
};

export default NavBar;
