import React from 'react';

const ProgramCard = ({ title, color, onClick }) => {
    const bgColor = color || '#A9A9A9';

    return (
        <div
            onClick={onClick}
            className="w-50 h-35 rounded-2xl flex-shrink-0 shadow-md flex justify-center items-center text-white text-lg font-semibold cursor-pointer "
            style={{ backgroundColor: bgColor }}
        >
            {title}
        </div>
    );
};

export default ProgramCard;
