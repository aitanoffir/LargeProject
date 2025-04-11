import React, { useState } from "react";
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
          <h2 className="text-xl font-bold mb-1">{title}</h2>

          <form>
            {/* Program Name */}
            <label htmlFor="name" className="input-label font-bold">
              Program Name:
            </label>
            <input
              type="text"
              name="program_name"
              value={formData.program_name}
              onChange={(e) =>
                setFormData({ ...formData, program_name: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />

            {/* Client */}
            <label htmlFor="client" className="input-label font-bold mt-4 block">
              Client
            </label>
            <select
              value={client}
              onChange={handleClientChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">-- Select client --</option>
              {clientNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Duration */}
            <label htmlFor="days" className="input-label font-bold block mt-4">
              Days:
            </label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />

            {/* Calendar (optional placeholder for future) */}
            {/* <label htmlFor="calendar" className="input-label font-bold block mt-4">
              Calendar:
            </label>
            <CalenderForm /> */}

            {/* Comments */}
            <label htmlFor="comments" className="input-label font-bold block mt-4">
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
              className="w-full border rounded-md p-2"
            />
          </form>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowConfirmCancel(true)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>

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
