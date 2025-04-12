import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";

const WorkoutCard = ({ id, day, focusName, onDelete }) => {

  const [exercises, setExercises] = useState([
    { name: "Bench Press", sets: 4, reps: "8-10" },
    { name: "Squats", sets: 3, reps: "10-12" },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleAdd = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "" }]);
  };


  const handleDelete = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const handleDeleteCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  return (
    <div className="relative border-2 border-purple-300 rounded shadow-md p-4 bg-white w-full font-medium">
      <div className="absolute top-2 right-2 flex gap-2">
        {isEditing ? (
          <button
            className="p-1 transition-transform duration-200 hover:scale-110 hover:cursor-pointer "
            onClick={() => setIsEditing(false)}
          >
            <FaCheck style={{ color: "green" }} />
          </button>
        ) : (
          <button
            className="p-1 transition-transform duration-200 hover:scale-110 hover:cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <FaPen size={13} style={{ color: "blue" }} />
          </button>
        )}

        <button className="p-1 transition-transform duration-200 hover:scale-110 hover:cursor-pointer" onClick={onDelete}>
          <ImCross size={13} style={{ color: "red" }} />
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="font-bold text-2xl text-gray-800 text-purple-900">{day}</h2>
        <h4 className="text-purple-900">{focusName}</h4>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border px-3 py-2 w-[50%] truncate">Exercise</th>
            <th className="border px-3 py-2 w-[10%]">Sets</th>
            <th className="border px-3 py-2 w-[20%]">Reps</th>
            {isEditing && <th className="border px-3 py-2 w-[10%] text-center"></th>}
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr
              key={i}
              className="border-b hover:bg-gray-50 h-[48px] text-center "
            >
              {/* Exercise Name */}
              <td className="border px-2 py-1 overflow-hidden truncate">
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full h-full px-0.5 border rounded-sm py-1.5 focus:ring-0 focus:outline-none text-sm"
                    value={ex.name}
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center h-8">
                    <span className="truncate">{ex.name}</span>
                  </div>
                )}
              </td>

              {/* Sets */}
              <td className="border px-1.5 text-center align-middle">
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full text-center h-full border rounded-sm py-1.5  focus:ring-0 focus:outline-none text-sm"
                    value={ex.sets}
                    onChange={(e) => handleChange(i, "sets", e.target.value)}
                  />
                ) : (
                  <div className="flex justify-center items-center h-8">
                    <span className="truncate">{ex.sets}</span>
                  </div>
                )}
              </td>

              {/* Reps */}
              <td className="border px-2 py-1 text-center">
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 h-8 text-sm text-center"
                    value={ex.reps}
                    onChange={(e) => handleChange(i, "reps", e.target.value)}
                  />
                ) : (
                  <span className="block h-8 leading-8">{ex.reps}</span>
                )}
              </td>

              {/* Actions */}
              {isEditing && <td className="border text-center">

                <button
                  className="p-1 rounded-full hover:bg-red-50 transition-transform duration-200 hover:scale-110 hover:cursor-pointer"
                  onClick={() => handleDelete(i)}
                >
                  <FaRegTrashAlt className="text-red-500" size={14} />
                </button>

              </td>}

            </tr>
          ))}
        </tbody>
        {isEditing && (
          <button
            className="p-1 rounded-full transition-transform duration-200 hover:scale-110 hover:cursor-pointer"
            onClick={handleAdd}
          >
            <IoMdAddCircleOutline className="text-green-800" size={14} />
          </button>
        )}
      </table>
    </div>
  );
};

export default WorkoutCard;
