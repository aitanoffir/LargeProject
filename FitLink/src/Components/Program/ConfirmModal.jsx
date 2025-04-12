import React from "react";

const ConfirmModal = ({ title, message, onClose, onConfirm }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-85">
        <h2 className="text-center text-xl font-bold mb-4 text-purple-900">{title}</h2>
        <p className="text-sm text-purple-900 text-center">{message}</p>

        <div className="flex justify-center gap-x-20 mt-6">

          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
