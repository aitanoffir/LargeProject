import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const ProgramModal = ({ onConfirm, onClose }) => {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    onClose(); // Actually cancel and close the modal
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Create New Program</h2>
          <p>Are you sure you want to add a new program?</p>
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
