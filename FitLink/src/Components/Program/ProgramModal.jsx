import React, { useState } from "react";
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import ConfirmModal from "./ConfirmModal";
import CalenderForm from "./CalenderForm";

const ProgramModal = ({ title, message, onConfirm, onClose }) => {
  const [formData, setFormData] = useState({
    program_name: "",
    days: "",
    comments: "",
    client_name: "",
    selected_days: [],
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const clientNames = ["Jeffrey", "Richard", "Melanie"];

  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [client, setClient] = useState();
  const [selectedDays, setSelectedDays] = useState([]);

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    onClose(); // Actually cancel and close the modal
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedDays((prev) =>
      checked ? [...prev, value] : prev.filter((day) => day !== value)
    );
  };

  const handleClientChange = (e) => {
    setClient(e.target.value);
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center overflow-auto z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >

        <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-center text-xl font-bold mb-1 text-purple-900">{title}</h2>

          <form>
            {/* Program Name */}

            <label htmlFor="name" className="input-label text-sm font-bold text-purple-900 flex items-center">
              Program Name:
            </label>
            <input
              type="text"
              name="program_name"
              value={formData.program_name}
              onChange={(e) =>
                setFormData({ ...formData, program_name: e.target.value })
              }
              className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
            />

            {/* Client */}
            <label htmlFor="client" className="input-label font-bold mt-4 block text-sm text-purple-900 flex items-center">
              Client
            </label>
            <select
              value={client}
              onChange={handleClientChange}
              className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
            >
              <option value="">Select</option>
              {clientNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Duration */}
            <label htmlFor="days" className="input-label font-bold block mt-4 text-sm text-purple-900 flex items-center">
              Days:
            </label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: e.target.value })
              }
              className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
            />

            {/* Calendar (optional placeholder for future) */}
            {/* <label htmlFor="calendar" className="input-label font-bold block mt-4">
              Calendar:
            </label>
            <CalenderForm /> */}

            {/* Comments */}
            <label htmlFor="comments" className="input-label font-bold block mt-4 text-sm text-purple-900 flex items-center">
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
            />
          </form>



          <div className="flex justify-between mt-6">
            <button

              onClick={() => setShowConfirmCancel(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
            >
              <FaArrowLeft className="mr-2" />Back
            </button>
            <button
              onClick={onConfirm}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
            >
              <FaPlus className="mr-2" />Add Program
            </button>
          </div>
        </div>
      </div>

      {/* Getting rid of this section bc the add client does not do this */}
      {showConfirmCancel && (
        <ConfirmModal
          title="Are you sure?"
          message="This will discard your changes."
          onConfirm={handleConfirmCancel}
          onClose={() => setShowConfirmCancel(false)}
        />
      )}
    </>
  );
};

export default ProgramModal;


/*onClick={() => setShowConfirmCancel(true)}*/