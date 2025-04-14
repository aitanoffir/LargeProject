import React from "react";

const ConfirmModal = ({ title, message, onClose, onConfirm }) => {
  return (
    <div
      className="fixed inset-0 flex py-8 items-center justify-center z-50 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-85">
        <div className="flex items-center gap-2 text-purple-800 font-bold text-lg">
          <span className="text-4xl">⚠️</span>
          <span>{title}</span>
        </div>

        <p className="text-sm text-purple-900 text-center mt-1">{message}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-red-500 hover:bg-red-700 text-white font-semibold shadow"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
