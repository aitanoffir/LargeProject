import React, { useState, useEffect, Suspense } from "react";
import Header from "../Components/Header";
import Section from "../Components/Program/CardSection";
import ProgramCard from "../Components/Program/ProgramCard";
import ConfirmModal from "../Components/Program/ConfirmModal";
import ProgramModal from "../Components/Program/ProgramModal";
import EditProgram from "../Components/Program/EditProgram";
import NavBar from "../Components/NavBar";
import { BsPlusLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


const ProgramPage = () => {
  const [customPrograms, setCustomPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showEditProgram, setShowEditProgram] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const getWorkout = async (clientId, token) => {
    const res = await fetch(
      `http://localhost:7000/api/accounts/workouts/client/${clientId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to fetch workout.");
    }
  
    const data = await res.json();
    return { ...data, clientId }; // You can spread data.data if that's your structure
  };
  
  const getAllWorkouts = async (clients, token) => {
    const programs = [];
  
    for (const client of clients) {
      try {
        const res = await fetch(
          `http://localhost:7000/api/accounts/workouts/client/${client._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
  
        if (res.ok) {
          const data = await res.json();
          programs.push({ ...data, clientId: client._id });
        } else if (res.status !== 404) {
          const errText = await res.text();
          console.error(`Error fetching workout for ${client._id}:`, errText);
        }
      } catch (error) {
        console.error(`Network error for ${client._id}:`, error);
      }
    }
  
    return programs;
  };
  
  const saveWorkout = async (program, token) => {
    const response = await fetch("http://localhost:7000/api/accounts/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        clientId: program.client._id,
        goal: program.client.goal,
        experience: program.client.experience,
        days: program.days,
        style: program.client.style,
        workoutPlan: program.workoutPlan,
      }),
    });
  
    if (!response.ok) throw new Error("Failed to save program");
  };
  
  const generateWorkout = async (newProgram) => {
    const response = await fetch(
      "http://localhost:7000/api/accounts/generate-workout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: newProgram.client.goal,
          experience: newProgram.client.experience,
          days: newProgram.selected_days,
          style: newProgram.client.style,
        }),
      }
    );
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to generate workout");
    }
  
    const data = await response.json();
  
    return {
      clientId: newProgram.clientId,
      goal: newProgram.goal,
      experience: newProgram.experience,
      days: newProgram.selected_days,
      style: newProgram.style,
      workoutPlan: data.workoutPlan,
    };
  };
  
  const sampleProgram = {
    clientId: "67faf81ba8e8c4f2815d5fe8",
    goal: "Strength",
    experience: "Beginner",
    days: ["Monday", "Wednesday", "Friday"],
    style: "Split",
    workoutPlan: {
      workouts: [
        {
          day: "Monday",
          focus: "Full Body Strength",
          notes:
            "Focus on form and full range of motion. Rest 1 minute between sets.",
          exercises: [
            { name: "Squat", sets: 3, reps: "10" },
            { name: "Push-up", sets: 3, reps: "15" },
            { name: "Bent-over Row", sets: 3, reps: "12" },
            { name: "Plank", sets: 3, reps: "60s" },
          ],
        },
        {
          day: "Wednesday",
          focus: "Cardio and Core",
          notes:
            "Maintain a steady cardio pace and focus on engaging core muscles throughout exercises.",
          exercises: [
            { name: "Jump Rope", sets: 5, reps: "60s" },
            { name: "Sit-up", sets: 3, reps: "20" },
            { name: "Mountain Climber", sets: 4, reps: "30" },
            { name: "Bicycle Crunch", sets: 3, reps: "20" },
          ],
        },
        {
          day: "Friday",
          focus: "Upper Body Strength",
          notes:
            "Use weights that are challenging but allow maintaining good form. Rest 60–90 seconds between sets.",
          exercises: [
            { name: "Bench Press", sets: 3, reps: "10" },
            { name: "Shoulder Press", sets: 3, reps: "10" },
            { name: "Lat Pulldown", sets: 3, reps: "12" },
            { name: "Bicep Curl", sets: 3, reps: "15" },
          ],
        },
      ],
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    //Check email verification
    const verified = localStorage.getItem("verified");
    if (verified === "false") {
      navigate("/email-verify");
    }

    fetchClients();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (clients.length && token) {
      getAllWorkouts(clients, token)
        .then((programs) => {
          if (programs.length > 0) {
            setCustomPrograms(programs);
          } else {
            console.log("⚠️ No workouts found, using fallback program");
            setCustomPrograms([sampleProgram]);
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching workouts:", error);
          setCustomPrograms([sampleProgram]);
        });
    }
  }, [clients]);

  console.log(customPrograms);

  const handleSaveWorkout = async (program) => {
    const token = localStorage.getItem("token");
  
    try {
      await saveWorkout(program, token);
      console.log("✅ Workout saved successfully");
    } catch (error) {
      console.error("❌ Error saving workout:", error.message);
    }
  };

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

  const handleAddProgram = async (newProgram) => {
    setIsLoading(true);
    setErrorMessage(null);
  
    try {
      const fullProgram = await generateWorkout(newProgram);
  
      if (
        fullProgram.clientId &&
        fullProgram.goal &&
        fullProgram.experience &&
        fullProgram.days &&
        fullProgram.style &&
        fullProgram.workoutPlan?.workouts?.length > 0
      ) {
        console.log("✅ Full program ready:", fullProgram);
      } else {
        console.warn("⚠️ Full program is missing fields:", fullProgram);
      }
  
      // Optionally save to backend
      // await saveWorkout(fullProgram, localStorage.getItem("token"));
  
      setCustomPrograms((prev) => [...prev, fullProgram]);
  
      const fullClient = clients.find((c) => c._id === newProgram.clientId);
      if (!fullClient) {
        console.warn("⚠️ Could not find fullClient for ID:", newProgram.clientId);
      }
      setSelectedClient(fullClient);
      setShowModal(false);
      setShowEditProgram(true);
    } catch (error) {
      console.error("❌ Error generating workout plan:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const clientsWithPrograms = clients.filter((client) =>
    customPrograms.some((program) => program.clientId === client._id)
  );

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
              {/* {clientsWithPrograms.length === 0 && (
                <div className="text-gray-500 italic px-4 py-2">
                  You haven't generated any client programs yet.
                </div>
              )}

              {clientsWithPrograms.map((client) => {
                const clientProgram = customPrograms.find(
                  (program) => program.clientId === client._id
                ); */}
              {clients.map((client) => {
                return (
                  <>
                    <ProgramCard
                      key={client._id}
                      title={`${client.firstName} ${client.lastName}`}
                      color={client.color}
                      onClick={() => {
                        setSelectedClient(client);
                        setShowEditProgram(true);
                      }}
                    />

                    {selectedClient &&
                      selectedClient._id === client._id &&
                      showEditProgram && (
                        <EditProgram
                          key={selectedClient._id}
                          client={selectedClient}
                          program={customPrograms.find(
                            (program) => program.clientId === selectedClient._id
                          )}
                          onClose={() => {
                            setSelectedClient(null);
                            setShowEditProgram(false);
                          }}
                        />
                      )}
                  </>
                );
              })}
              ;
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

            <Suspense>
              {isLoading ? (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm bg-black/30">
                  <span className="text-purple-700 font-semibold text-lg">
                    Generating Program...
                  </span>
                  <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-purple-600 border-opacity-50"></div>
                </div>
              ) : (
                showModal && (
                  <ProgramModal
                    clients={clients}
                    title="Create New Program"
                    onConfirm={handleAddProgram}
                    onClose={() => setShowModal(false)}
                  />
                )
              )}
            </Suspense>

            {showEditProgram && selectedClient && (
              <EditProgram
                key={selectedClient._id}
                client={selectedClient}
                program={customPrograms}
                oprogram={customPrograms.find((p) => p.clientId === selectedClient._id)}
                onClose={() => {
                  setSelectedClient(null);
                  setShowEditProgram(false);
                }}
                onSave={(program) => {
                  const token = localStorage.getItem("token");
                  saveWorkout(program, token);
                }}
                onEdit={(program) => {
                  const token = localStorage.getItem("token");
                  editWorkout(program, token);
                }}
                onDelete={(program) => {
                  const token = localStorage.getItem("token");
                  deleteWorkout(program.clientId, token);
                }}
              />
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
