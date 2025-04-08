import { FaHome, FaCalendarAlt, FaUserFriends, FaCog, FaUserCircle, FaRegEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // <-- make sure this is imported

const NavBar = () => {
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
        <FaUserCircle className="text-white text-4xl cursor-pointer" />
      </div>
    </div>
  );
};

export default NavBar;
