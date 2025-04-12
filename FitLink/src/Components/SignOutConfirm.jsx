import React from "react";

const SignOutConfirm = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-100 h-40 flex flex-col items-center justify-center relative p-6">

                <h2 className="text-center text-xl font-bold mb-4 text-purple-900">Are you sure you want to sign out?</h2>
                <div className="flex justify-center gap-x-20 mt-1">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignOutConfirm;
