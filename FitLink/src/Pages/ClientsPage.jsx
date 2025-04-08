// ClientsList.jsx
import { useState } from 'react';
import NavBar from '../Components/NavBar';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddClientModal from '../Components/AddClientModal';

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <NavBar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">My Clients</h1>

              <button onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center">
              <FaPlus className="mr-2" /> Add Client
              </button>
              {showAddModal && (
              <AddClientModal onClose={() => setShowAddModal(false)} />
              )}
            </div>
            
            <div className="mt-4 flex gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="alphabetical">A-Z</option>
                <option value="workoutDate">Closest Workout</option>
              </select>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Workout Date', 'Phone Number', 'Email', 'Notes', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Client data will be displayed here
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientsList;