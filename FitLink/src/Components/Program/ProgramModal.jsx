import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ProgramModal = ({ title, message, onConfirm, onClose }) => {

    const [formData, setFormData] = useState({
        program_name: '',
        duration: '',
        comments: '',
        client_name: '',
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
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-150">
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          {/* <p>{message}</p> */}

          <form>
            {/* Program Name */}
            <label for="name" className="input-label font-bold">
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
            <h3  className="font-bold">Days of the Week</h3>

            {/* Days */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {daysOfWeek.map((day) => (
                <label key={day}>
                  <input
                    className="mx-2"
                    type="checkbox"
                    value={day}
                    checked={selectedDays.includes(day)}
                    onChange={handleCheckboxChange}
                  />
                  {day}
                </label>
              ))}
            </div>

            {/* Client */}
            <label >
              <h3 className="font-bold">Client:</h3>
              <select value={client} onChange={handleClientChange}>
                <option value="">-- Select client --</option>
                {clientNames.map((name) => (
                    <option key={name} value={name}>
                        {name}
                    </option>
                ))}
              </select>
            </label>

            {/* Duration */}
            <label for="duration" className="input-label font-bold">
              Duration:
            </label>
            <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full border rounded-md p-2"
            />
            <label for="comments" className="block mt-4">
  Additional Comments:
</label>
<textarea
  id="comments"
  name="comments"
  value={formData.comments || ''}
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
