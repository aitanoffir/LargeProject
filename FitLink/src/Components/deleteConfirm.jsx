import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const DeleteConfirm = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <FaRegTrashAlt className="text-purple-600 text-5xl" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-purple-900">Delete Client</h1>
                    <p className="text-gray-600">
                        Are you sure you want to permanently delete this client?
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;
