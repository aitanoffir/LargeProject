import React from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { MdInfoOutline, MdWarningAmber } from "react-icons/md";

const Popup = ({ title, message, type = "success", onClose }) => {
  const typeStyles = {
    success: {
      className: "bg-green-900 border-green-500 text-white",
      icon: <FaRegCheckCircle size={18} />,
    },
    error: {
      className: "bg-red-900 border-red-500 text-white",
      icon: <MdErrorOutline size={18}/>,
    },
    info: {
      className: "bg-blue-900 border-blue-500 text-white",
      icon: <MdInfoOutline size={18} />,
    },
    warning: {
      className: "bg-yellow-800 border-yellow-500 text-white",
      icon: <MdWarningAmber size={18} />,
    },
  };

  const { className, icon } = typeStyles[type] || typeStyles.success;

  return (
    <div
      className={`absolute top-20 right-4 z-50 border rounded-lg shadow-lg px-6 py-4 min-w-[300px] max-w-md flex items-start gap-3 ${className}`}
    >
      {/* Icon */}
      <div className="mt-1">{icon}</div>

      {/* Content */}
      <div className="space-y-1 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-200">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-white hover:opacity-70 mt-1"
      >
        <RxCross2 />
      </button>
    </div>
  );
};

export default Popup;