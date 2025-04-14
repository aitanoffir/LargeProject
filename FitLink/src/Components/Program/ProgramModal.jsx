import React, { useEffect, useState } from "react";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import CalenderForm from "./CalenderForm";

const ProgramModal = ({ clients, title, onConfirm, onClose }) => {

  const [formData, setFormData] = useState({
    clientId: "",
    experience: "",
    goal: "",
    style: "",
    days: [],
  });

  const [client, setClient] = useState();

  useEffect(() => {
    if (!client) return;
  
    const updatedFields = {
      clientId: client._id,
    };
  
    if (client.workoutSchedule) {
      updatedFields.days = client.workoutSchedule.map(entry => entry.day);
    }
  
    setFormData((prev) => ({ ...prev, ...updatedFields }));
  }, [client]);

  const handleClientChange = (e) => {
    const selectedId = e.target.value; // e.g. "67faf9f7a8e8c4f2815d6035"
    const foundClient = clients.find((c) => c._id === selectedId);
    setClient(foundClient); // Now client is the full object
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
          {/*w-600px*/}
          <h2 className="text-center text-xl font-bold mb-1 text-purple-900">
            {title}
          </h2>

          <form>
            {/* Client */}
            <label
              htmlFor="client"
              className="input-label font-bold mt-4 text-sm text-purple-900 items-center"
            >
              Client
            </label>
            <select
              // if client exists, use its _id, otherwise ""
              value={client ? client._id : ""}
              onChange={(e) => {
                handleClientChange(e);
                setFormData({ ...formData, client: e.target.value });
              }}
              className="w-full border-2 rounded p-2 border-purple-300 text-sm font-medium"
            >
              <option value="">Select</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>

    
            {/*Experience */}
            <label
              htmlFor="client"
              className="input-label font-bold mt-4 text-sm text-purple-900 items-center"
            >
              Experience
            </label>
            <input
              value={formData.experience}
              placeholder="e.g. Beginner, Intermediate, Advanced"
              onChange={(e) => {
                setFormData({ ...formData, experience: e.target.value });
              }}
              className="w-full border-2 rounded p-2 border-purple-300 text-sm font-medium"
            />

            {/*Goal*/}
            <label
              htmlFor="client"
              className="input-label font-bold mt-4 text-sm text-purple-900 items-center"
            >
              Goal
            </label>
            <input
              value={formData.goal}
              placeholder="e.g. Weight Loss, Hypertrophy, Strength"
              onChange={(e) => {
                setFormData({ ...formData, goal: e.target.value });
              }}
              className="w-full border-2 rounded p-2 border-purple-300 text-sm font-medium"
            />

            {/*Training Style */}
            <label
              htmlFor="client"
              className="input-label font-bold mt-4 text-sm text-purple-900 items-center"
            >
              Training Style
            </label>
            <input
              value={formData.style}
              placeholder="e.g. Upper/Lower Split, Powerlifting, Circuit Training, Weightlifting"
              onChange={(e) => {
                setFormData({ ...formData, style: e.target.value });
              }}
              className="w-full border-2 rounded p-2 border-purple-300 text-sm font-medium"
            />

            {/* Availability */}
            {/* <label
              htmlFor="days"
              className="input-label font-bold mt-4 text-sm text-purple-900 items-center"
            >
              Availability:
            </label> */}
{/* 
            <CalenderForm
              color={client?.color}
              schedule={client?.workoutSchedule}
            /> */}

            {/* Comments */}
            {/* <label
              htmlFor="comments"
              className="input-label font-bold block mt-4 text-sm text-purple-900 flex items-center"
            >
              Additional Comments:
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments || ""}
              placeholder="Ex. My client has chronic shoulder pain"
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              rows={4}
              className="w-full border-2 rounded p-2 border-purple-300 text-sm font-medium"
            /> */}
          </form>

          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(formData)
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
            >
              <FaPlus className="mr-2" />
              Add Program
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramModal;
