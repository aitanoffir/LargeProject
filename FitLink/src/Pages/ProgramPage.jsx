import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Section from '../Components/Program/CardSection';
import ProgramCard from '../Components/Program/ProgramCard';
import ConfirmModal from '../Components/Program/ConfirmModal';
import ProgramModal from '../Components/Program/ProgramModal';
import EditProgram from '../Components/Program/EditProgram';
import NavBar from '../Components/NavBar';
import { BsPlusLg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';


const ProgramPage = () => {
  const [customPrograms, setCustomPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {

    //Check email verification
    const verified = localStorage.getItem('verified');
    if (verified === "false") {
      navigate("/email-verify");
    }

    fetchClients();
  }, []);



  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    const trainerId = localStorage.getItem("userId");
    if (!token || !trainerId) {
      console.error("Token or Trainer ID not found.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7000/api/accounts/client?trainer=${trainerId}`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        try {
          const errData = JSON.parse(text);
          if (
            response.status === 404 &&
            errData.message === "No clients found"
          ) {
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

  const handleAddProgram = () => {
    const newTitle = `Custom Program ${customPrograms.length + 1}`;
    setCustomPrograms([...customPrograms, { title: newTitle }]);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {" "}
        {/* Main content area */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-5 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text=gray-800">
              My Programs
            </h1>
          </div>
        </header>
        <div className="">
          <Section title="Clients Programs">
            <div className="ml-1 flex overflow-x-auto space-x-4 px-4">
              {clients.slice().reverse().map((client) => (
                <>
                  <ProgramCard
                    key={client._id}
                    title={`${client.firstName} ${client.lastName}`}
                    color={client.color}
                    onClick={() => {
                      setSelectedClient(client);
                      setSelectedClient(client);
                      setShowEditModal(true);
                    }}
                  />
                ))}

              {/*On click shows the program based on the client id*/}
              {selectedClient && (
                <EditProgram
                  key={selectedClient._id}
                  client={selectedClient}
                  onClose={() => setSelectedClient(null)}
                />
              )}
                  {showEditModal && selectedClient?._id === client._id && (
                    <EditProgram
                      client={selectedClient}
                      onClose={() => {
                        setShowEditModal(false);
                        setSelectedClient(null);
                      }}
                    />
                  )}
                </>
              ))}
            </div>
          </Section>

          <Section title="New Program">
            <div className="flex overflow-x-auto space-x-4 px-4">
              <ProgramCard
                title={<BsPlusLg size={100} color="white" />}
                color="#319FED"
                onClick={() => setShowModal(true)}
              />
            </div>
            {showModal && (
              <ProgramModal
                title="Create New Program"
                message="Are you sure you want to add a new program?"
                onConfirm={handleAddProgram}
                onClose={() => setShowModal(false)}
              />
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
