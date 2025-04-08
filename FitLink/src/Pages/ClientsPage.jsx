import { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import AddClientModal from '../Components/AddClientModal';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token);
    if (!token) {
      console.error("Token not found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:7000/api/accounts/client?lastName=${searchTerm || 'a'}`, {
        headers: { Authorization: `${token}` },
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errData = JSON.parse(text);
          if (response.status === 404 && errData.message === "No clients found") {
            setClients([]); // nothing found so I just empty the list
            return;
          }
          console.error("Fetch error:", errData.message);
        } catch {
          console.error("Unexpected error:", text);
        }
        return;
      }

      const data = await response.json();
      if (data.success) {
        setClients(data.clients);
      } else {
        console.error("Fetch failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    let sorted = [...clients];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === 'workoutDate') {
      sorted.sort((a, b) => new Date(a.workoutDate) - new Date(b.workoutDate));
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (searchTerm) {
      sorted = sorted.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClients(sorted);
    setCurrentPage(1);
  }, [searchTerm, sortBy, clients]);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:7000/api/accounts/client/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        return;
      }

      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleViewNotes = (client) => {
    console.log("Viewing notes for:", client);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">My Clients</h1>
              <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center">
                <FaPlus className="mr-2" /> Add Client
              </button>
              {showAddModal && (
                <AddClientModal onClose={() => {
                  setShowAddModal(false);
                  fetchClients();
                }} />
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
                  {['Name', 'Workout Date', 'Phone Number', 'Email', 'Notes', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentClients.length > 0 ? currentClients.map(client => (
                  <tr key={client._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{client.firstName} {client.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.workoutDate || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-500 underline" onClick={() => handleViewNotes(client)}>View Notes</button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleDelete(client._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No clients found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white border'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientsList;
