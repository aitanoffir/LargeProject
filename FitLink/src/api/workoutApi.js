export const fetchClients = async (token, trainerId) => {
  const response = await fetch(
    `http://localhost:7000/api/accounts/client?trainer=${trainerId}`,
    {
      headers: { Authorization: `${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch clients");
  const data = await response.json();
  return data.clients;
};

export const getWorkout = async (clientId, token) => {
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

export const getAllWorkouts = async (clients, token) => {
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

export const saveWorkout = async (program, token) => {
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

export const generateWorkout = async (newProgram) => {
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
