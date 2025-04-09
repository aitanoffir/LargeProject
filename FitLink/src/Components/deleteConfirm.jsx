import React from "react";

const DeleteConfirm = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-100 h-40 flex flex-col items-center justify-center relative p-6">
                <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this client?</h2>
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700">
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="cursor-pointer bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;