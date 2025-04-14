import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

const WorkoutCard = (props) => {
  const [exercises, setExercises] = useState(
    (props.exercises || []).map((entry) => ({
      name: entry.name,
      sets: entry.sets,
      reps: entry.reps,
    }))
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
    props.onUpdate(props.id, { exercises: updated });
  };

  const handleAdd = () => {
    const updated = [...exercises, { name: "", sets: "", reps: "" }];
    setExercises(updated);
    props.onUpdate(props.id, { exercises: updated });
  };

  const handleDelete = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
    props.onUpdate(props.id, { exercises: updated });
  };

  const handleDeleteCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  return (
    <div className="relative border-agreeable-grey rounded-lg shadow-md p-4 bg-white w-full my-5">
      <div className="absolute top-5 right-5 flex gap-2">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 transition"
              onClick={() => {
                props.onConfirm();
                setIsEditing(false);
              }}
            >
              <FaCheck size={14} />
              Confirm
            </button>

            <button
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 transition"
              onClick={props.onDelete}
            >
              <ImCross size={14} />
              Delete
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
            onClick={() => setIsEditing(true)}
          >
            <FaPen size={14} />
            Edit
          </button>
        )}
      </div>

      {/* Header */}
      <div className="text-left mb-4">
        <h2 className="font-bold text-2xl text-gray-800">
          {props.day || "Day"}
        </h2>
        <div className="flex items-center mt-1 gap-1">
          <SlCalender />
          <h4 className="text-gray-500">
            {props.startTime} - {props.endTime}
          </h4>
        </div>
        {isEditing ? (
          <>
            <input
              type="text"
              className="mt-2 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none text-sm"
              value={props.focus}
              onChange={(e) =>
                props.onUpdate(props.id, { focus: e.target.value })
              }
            />
            <textarea
              value={props.notes}
              className="mt-2 w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none text-sm"
              onChange={(e) =>
                props.onUpdate(props.id, { notes: e.target.value })
              }
            />
          </>
        ) : (
          <h4 className="text-gray-500">
            {props.focus} - {props.notes}
          </h4>
        )}
      </div>

      {/* Table */}
      <div className="my-3 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left border-collapse table-auto my-3 rounded-lg">
          <thead className="rounded-lg">
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-[#e5e7eb] px-3 py-2 w-[50%] truncate">
                Exercise
              </th>
              <th className="border border-[#e5e7eb] px-3 py-2 w-[10%]">
                Sets
              </th>
              <th className="border border-[#e5e7eb] px-3 py-2 w-[20%]">
                Reps
              </th>

              <th className="border border-[#e5e7eb] px-3 py-2 w-[10%] text-center"></th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex, i) => (
              <tr
                key={i}
                className="border border-[#e5e7eb] hover:bg-gray-50 h-[48px] text-center "
              >
                {/* Exercise Name */}
                <td className="border border-[#e5e7eb] px-2 py-1 overflow-hidden truncate">
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full h-full px-0.5 border border-[#e5e7eb] rounded-sm py-1.5 focus:ring-0 focus:outline-none text-sm"
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
                <td className="border border-[#e5e7eb] px-1.5 text-center align-middle">
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full text-center h-full border border-[#e5e7eb] rounded-sm py-1.5  focus:ring-0 focus:outline-none text-sm"
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
                <td className="border border-[#e5e7eb] px-2 py-1 text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 h-8 text-sm text-center"
                      value={ex.reps}
                      onChange={(e) => handleChange(i, "reps", e.target.value)}
                    />
                  ) : (
                    <span className="block h-8 leading-8">{ex.reps}</span>
                  )}
                </td>

                {/* Actions */}
                {isEditing && (
                  <td className="border border-[#e5e7eb] text-center">
                    {isEditing ? (
                      <button
                        className="p-1 rounded-full hover:bg-red-50 transition-transform duration-200 hover:scale-110 hover:cursor-pointer"
                        onClick={() => handleDelete(i)}
                      >
                        <FaRegTrashAlt className="text-red-500" size={14} />
                      </button>
                    ) : (
                      <span className="text-black"> _ </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-all"
        >
          <IoMdAddCircleOutline size={16} />
          Add Row
        </button>
      )}
    </div>
  );
};

export default WorkoutCard;
