import React from 'react';

const ProgramCard = ({ title, color, onClick }) => {
    const bgColor = color || '#A9A9A9';

    return (
        <div
            onClick={onClick}
            className="mt-1 mb-2 ml-5 w-74 h-54 flex-shrink-0 shadow-md flex justify-center items-center text-white text-lg font-semibold cursor-pointer "
            style={{ backgroundColor: bgColor }}
        >
            {title}
        </div>
    );
};

export default ProgramCard;
