import { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import AddClientModal from '../Components/AddClientModal';
import UpdateClientModal from '../Components/updateClientModal';
import DeleteConfirm from '../Components/deleteConfirm';
import ViewClientNotes from '../Components/ViewClientNotes';
import { useNavigate } from 'react-router-dom';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedClientForNotes, setSelectedClientForNotes] = useState(null);

  const navigate = useNavigate();

  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    const trainerId = localStorage.getItem("userId");
    if (!token || !trainerId) {
      console.error("Token or Trainer ID not found.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:7000/api/accounts/client?trainer=${trainerId}`, {
        headers: { Authorization: `${token}` },
      });
  
      if (!response.ok) {
        const text = await response.text();
        try {
          const errData = JSON.parse(text);
          if (response.status === 404 && errData.message === "No clients found") {
            setClients([]);
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
        // Clients now include their notes directly
        setClients(data.clients);
      } else {
        console.error("Fetch failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const getNextWorkout = (schedule) => {
    if (!schedule?.length) return 'No scheduled workouts';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
  
    const converted = schedule.map(ws => {
      const dayMatch = days.find(d => 
        d.toLowerCase().startsWith(ws.day.toLowerCase().substring(0, 3))
      );
      const start = convertTimeToMinutes(ws.startTime);
      const end = convertTimeToMinutes(ws.endTime);
      
      return dayMatch && start && end ? {
        dayIndex: days.indexOf(dayMatch),
        startMinutes: start,
        endMinutes: end
      } : null;
    }).filter(ws => ws !== null);
  
    const upcomingWorkouts = [];
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDayIndex = (currentDayIndex + dayOffset) % 7;
      const dayWorkouts = converted.filter(ws => ws.dayIndex === targetDayIndex);
  
      dayWorkouts.forEach(workout => {
        const workoutTime = targetDayIndex * 1440 + workout.startMinutes;
        const currentTotalMinutes = currentDayIndex * 1440 + currentTime;
        
        let timeDifference = workoutTime - currentTotalMinutes;
        if (timeDifference < 0) timeDifference += 7 * 1440;
        
        upcomingWorkouts.push({
          timeDifference,
          dayIndex: targetDayIndex,
          start: workout.startMinutes,
          end: workout.endMinutes
        });
      });
    }
  
    if (upcomingWorkouts.length === 0) return 'No upcoming workouts';
  
    const closest = upcomingWorkouts.reduce((prev, current) => 
      prev.timeDifference < current.timeDifference ? prev : current
    );
  
    const targetDay = days[closest.dayIndex].slice(0, 3);
    return `${targetDay} ${formatTime(closest.start)} - ${formatTime(closest.end)}`;
  };
  
  const convertTimeToMinutes = (timeString) => {
    if (!timeString) return null;
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    return (hours % 12) * 60 + minutes + (period === 'PM' ? 720 : 0);
  };
  
  const formatTime = (minutes) => {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const getNextWorkoutTimestamp = (schedule) => {
    if (!schedule?.length) return Infinity;
    
    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    let closestDate = Infinity;
  
    schedule.forEach(workout => {
      const dayIndex = days.findIndex(d => d.toLowerCase() === workout.day.toLowerCase());
      if (dayIndex === -1) return;
      
      const startMinutes = convertTimeToMinutes(workout.startTime);
      if (!startMinutes) return;
  
      let daysToAdd = dayIndex - currentDayIndex;
      if (daysToAdd < 0) daysToAdd += 7;
      
      if (daysToAdd === 0 && startMinutes <= currentTime) {
        daysToAdd = 7;
      }
  
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysToAdd);
      nextDate.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
      
      closestDate = Math.min(closestDate, nextDate.getTime());
    });
  
    return closestDate;
  };

  useEffect(() => {
    const verified = localStorage.getItem('verified');
    if (verified === "false") {
      navigate("/email-verify");
    }

    fetchClients();
  }, []);

  useEffect(() => {
    let sorted = [...clients];
  
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === 'workoutDate') {
      sorted.sort((a, b) => {
        const aTime = getNextWorkoutTimestamp(a.workoutSchedule);
        const bTime = getNextWorkoutTimestamp(b.workoutSchedule);
        return aTime - bTime;
      });
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

  const handleDeleteClick = (id) => {
    setClientToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:7000/api/accounts/client/${clientToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete failed:", errorText);
        return;
      }

      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setShowDeleteConfirm(false);
      setClientToDelete(null);
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
  };

  const handleViewNotes = (client) => {
    setSelectedClientForNotes(client);
    setShowNotesModal(true);
  };

  const handleSaveNote = async (noteData) => {
    const token = localStorage.getItem("token");
    try {
      const url = noteData.noteId 
        ? `http://localhost:7000/api/accounts/client/${noteData.clientId}/notes/${noteData.noteId}`
        : `http://localhost:7000/api/accounts/client/${noteData.clientId}/notes`;
  
      const response = await fetch(url, {
        method: noteData.noteId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({
          title: noteData.title,
          content: noteData.content
        })
      });
  
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Note operation failed:", responseData);
        alert(`Error: ${responseData.message || 'Unknown error'}`);
        return;
      }
  
      console.log("Note operation successful:", responseData);
      fetchClients();
      
      setSelectedClientForNotes(prev => prev ? {
        ...prev,
        notes: noteData.noteId 
          ? prev.notes.map(n => n._id === noteData.noteId ? responseData.note : n)
          : [...prev.notes, responseData.note]
      } : null);
  
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to connect to server");
    }
  };

  const handleDeleteNote = async (clientId, noteId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:7000/api/accounts/client/${clientId}/notes/${noteId}`, 
        {
          method: 'DELETE',
          headers: { Authorization: `${token}` },
        }
      );
  
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Delete failed:", responseData);
        alert(`Error: ${responseData.message}`);
        return;
      }
  
      console.log("Delete successful:", responseData);
      fetchClients();
      
      setSelectedClientForNotes(prev => prev ? {
        ...prev,
        notes: prev.notes.filter(n => n._id !== noteId)
      } : null);
  
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">My Clients</h1>
              <button 
                onClick={() => setShowAddModal(true)} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
              >
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
                  <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Next Workout
                  </th>
                  <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Phone Number
                  </th>
                  <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edit Info
                  </th>
                  <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentClients.length > 0 ? currentClients.map(client => (
                  <tr key={client._id}>
                    <td className="px-2 py-1 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: client.color || '#7CC9F7' }}
                        />
                        <span className="text-sm">{client.firstName} {client.lastName}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm">{getNextWorkout(client.workoutSchedule)}</span>
                    </td>
                    <td className="px-2 py-1 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm">{client.phoneNumber}</span>
                    </td>
                    <td className="px-2 py-1 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm">{client.email}</span>
                    </td>
                    <td className="px-2 py-1 md:px-6 md:py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleViewNotes(client)} 
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-1 transition-colors text-xs md:text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Notes</span>
                      </button>
                    </td>
                    <td className="px-2 py-1 md:px-6 md:py-4 whitespace-nowrap flex items-center">
                      <button 
                        onClick={() => handleEdit(client)} 
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-1 transition-colors text-xs md:text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Info</span>
                      </button>
                    </td>
                    <td className="px-2 py-1 md:px-6 md:py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleDeleteClick(client._id)} 
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors text-xs md:text-sm"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-2 py-1 md:px-6 md:py-4 text-center text-gray-500">
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-1 mx-1 rounded text-white ${currentPage === i + 1 ? 'bg-purple-900 hover:bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'} text-xs md:text-sm`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>

        {showNotesModal && selectedClientForNotes && (
          <ViewClientNotes
            client={selectedClientForNotes}
            onClose={() => setShowNotesModal(false)}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {selectedClient && (
          <UpdateClientModal 
            client={selectedClient}
            onClose={() => {
              setSelectedClient(null);
              fetchClients();
            }}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirm
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ClientsList;
