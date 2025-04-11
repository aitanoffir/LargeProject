import React, {useState} from "react";
import WorkoutCard from "./WorkoutCard";

const EditProgram = ({ clientName }) => {

  const [cards, setCards] = useState([
    { id: 1, day: "Monday", focusName: "Chest" },
    { id: 2, day: "Tuesday", focusName: "Legs" },
    { id: 3, day: "Wednesday", focusName: "Back" },
    { id: 4, day: "Thursday", focusName: "Core" },
    { id: 5, day: "Friday", focusName: "Arms" },
    { id: 6, day: "Saturday", focusName: "Tricep" },
    { id: 7, day: "Sunday", focusName: "Legs" },
    // Add more as needed
  ]);

  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Title */}
      <div className="text-center font-extrabold text-4xl text-gray-800 mb-8">
        {clientName ? `${clientName} Program` : "Guest Program"}
      </div>

      {/* Workout Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto mb-10">
        {cards.map((card) => (
          <WorkoutCard
            key={card.id}
            id={card.id}
            day={card.day}
            focusName={card.focusName}
            onDelete={() => handleDeleteCard(card.id)}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button className="btn bg-gray-300 hover:bg-gray-400 text-gray-800">
          Back
        </button>
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  );
};

export default EditProgram;
