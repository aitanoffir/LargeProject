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

  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);
  const [showEditProgram, setShowEditProgram] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  useEffect(() => {
    console.log("🧠 selectedClient updated:", selectedClient);
  }, [selectedClient]);
  
  useEffect(() => {
    console.log("📋 selectedWorkoutPlan updated:", selectedWorkoutPlan);
  }, [selectedWorkoutPlan]);

  const getWorkout = async (clientId) => {
    const token = localStorage.getItem("token");
    const trainerId = localStorage.getItem("userId");
    if (!token || !trainerId) {
      console.error("Token or Trainer ID not found.");
      return;
    }

    try {
      console.log("Getting workout for", {clientId})
      const response = await fetch(
        `http://localhost:7000/api/accounts/workouts/client/${clientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch workout.");
      }

      const data = await response.json(); // <-- must call as a function
      console.log("Got data", { data: data.data })
      return data.data;
    } catch (error) {
      console.error(`Network error for ${clientId}:`, error);
      return null;
    }
  };

  const getWorkoutFromClient = async (clientId) => {
    try {
      const workoutPlan = await getWorkout(clientId);
      setSelectedWorkoutPlan(workoutPlan);
      return 
    } catch (error) {
      console.error("Error fetching workout:", error);
      setSelectedWorkoutPlan(null);
    }
  };

  const saveWorkout = async (program) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:7000/api/accounts/workouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            clientId: program.clientId,
            goal: program.goal,
            experience: program.experience,
            days: program.days,
            style: program.style,
            workoutPlan: program.workoutPlan
          }),
        }
      );

      if (response.status == 409) {
        return 409;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to saved program");
      }

      console.log("Program saved successfully");
    } catch (err) {
      console.error("Edit error:", err.message);
    }
  };

  const editWorkout = async (program, workoutId) => {
    const token = localStorage.getItem("token");

    try {
      console.log("Editing Program", { program });
      const response = await fetch(
        `http://localhost:7000/api/accounts/workouts/${workoutId}`, // assume RESTful
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            clientId: program.clientId,
            goal: program.goal,
            experience: program.experience,
            days: program.days,
            style: program.style,
            workoutPlan: program.workoutPlan
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to edit program");
      }

      console.log("Program edited successfully", { program });
    } catch (err) {
      console.error("Edit error:", err.message);
    }
  };

  const deleteWorkout = async (program) => {
    const token = localStorage.getItem("token");
    const trainerId = localStorage.getItem("userId");
    if (!token || !trainerId) {
      console.error("Token or Trainer ID not found.");
      return;
    }

    console.log("Saving new program", { program });

    try {
      const response = await fetch(
        "http://localhost:7000/api/accounts/workouts",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            workoutId: workoutId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete program");

      console.log("Program deleted successfully");
    } catch (err) {
      console.error("Delete error:", err.message);
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

  const generateProgram = async (formData) => {
    setIsLoading(true);
    setErrorMessage(null);

    const token = localStorage.getItem("token");
    const trainerId = localStorage.getItem("userId");
    if (!token || !trainerId) {
      console.error("Token or Trainer ID not found.");
      return;
    }

    try {
      console.log("Generating Program", { formData });
      const response = await fetch(
        "http://localhost:7000/api/accounts/generate-workout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            goal: formData.goal,
            experience: formData.experience,
            days: formData.days,
            style: formData.style,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the workout plan.");
      }

      const data = await response.json();

      const program = {
        clientId: formData.clientId,
        goal: formData.goal,
        experience: formData.experience,
        days: formData.days,
        style: formData.style,
        workoutPlan: data.workoutPlan.workouts, // <- HAS TO CALL THE NESTED STRUCTURE SINCE ITS DIFFERENT WHEN GENERATED}
      };

      {/*Try to save workout but fail due to existing workout-> get the workoutId -> using workoutId to update instead*/}
      const result = await saveWorkout(program);
      if (result === 409) {
        
        let data = await getWorkout(program.clientId);
        let workoutId = data._id;
        await editWorkout(program, workoutId);
      }

      setShowModal(false);
    } catch (error) {
      console.error("❌ Error generating workout plan:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
                      onClick={async () => {
                        setSelectedClient(client);
                        const workout = await getWorkout(client._id);
                        console.log("Setting workout to", workout)
                        if (workout) {
                          setSelectedWorkoutPlan(workout);
                          setShowEditProgram(true);
                        }
                      }}
                    />

                    {showEditProgram && selectedClient && selectedWorkoutPlan && (
                      <EditProgram
                        key={selectedClient._id}
                        client={selectedClient}
                        clientId={selectedClient._id}
                        goal={selectedWorkoutPlan.goal}
                        days={selectedWorkoutPlan.days}
                        style={selectedWorkoutPlan.style}
                        workoutPlan={selectedWorkoutPlan.workoutPlan}
                        onClose={() => {
                          setSelectedClient(null);
                          setShowEditProgram(false);
                        }}
                        onSave={saveWorkout}
                        onEdit={editWorkout}
                        onDelete={deleteWorkout}
                      />
                    )}
                  </>
                );
              })}
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
                    onConfirm={generateProgram}
                    onClose={() => setShowModal(false)}
                  />
                )
              )}
            </Suspense>
          </Section>
        </div>
      </div>
    </div>
  );
};
export default ProgramPage;
