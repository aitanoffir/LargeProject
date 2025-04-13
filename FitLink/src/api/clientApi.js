export const getClientsByTrainer = async (trainerId, token) => {
    if (!token || !trainerId) {
      throw new Error("Token or Trainer ID missing.");
    }
  
    const response = await fetch(
      `http://localhost:7000/api/accounts/client?trainer=${trainerId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  
    if (!response.ok) {
      const text = await response.text();
      try {
        const errData = JSON.parse(text);
        if (response.status === 404 && errData.message === "No clients found") {
          return []; // Return empty list instead of throwing
        }
        throw new Error(errData.message || "Failed to fetch clients.");
      } catch {
        throw new Error("Unexpected response while fetching clients.");
      }
    }
  
    const data = await response.json();
    if (data.success) {
      return data.clients;
    } else {
      throw new Error(data.message || "Client fetch failed.");
    }
  };