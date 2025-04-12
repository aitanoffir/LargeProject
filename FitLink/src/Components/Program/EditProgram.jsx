import React, { useState } from "react";
import WorkoutCard from "./WorkoutCard";
import { FaRegSave, FaArrowLeft } from 'react-icons/fa';


const EditProgram = ({ clientName, onConfirm, onClose }) => {

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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 flex items-center justify-center overflow-auto z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        {/* Modal container */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Title - CURRENTLY NOT DISPLAYING CLIENT INFO YET */}
          <div className="text-center text-2xl font-bold mb-5 text-purple-900">
            {clientName ? `${client.firstName} ${client.lastName} Program` : "Guest Program"}
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
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700">
              <FaArrowLeft className="mr-2" />Back
            </button>
            <button
              onClick={onConfirm}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700">

              <FaRegSave className="mr-2 text-xl" />Save
            </button>
          </div>
        </div>
      </div>
    </>
  );

};

export default EditProgram;
