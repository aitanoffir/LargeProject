import React, {useState} from "react";
import WorkoutCard from "./WorkoutCard";

const EditProgram = (prop) => {

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-50 p-8 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">

        {/* Close Button (optional top-right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        {/* Title */}
        <div className="text-center font-extrabold text-4xl text-gray-800 mb-8">
          {prop?.clientName ? `${prop?.clientName} Program` : "Guest Program"}
        </div>

        {/* Workout Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
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
          <button
            onClick={prop.onClose}
            className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={prop.onSave}
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProgram;
