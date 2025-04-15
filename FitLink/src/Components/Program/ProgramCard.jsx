import React from 'react';

const ProgramCard = (props) => {
    const bgColor = props.color || '#A9A9A9';

    return (
        <div
            onClick={props.onClick}
            className="w-55 h-35 rounded-2xl flex-shrink-0 shadow-md flex justify-center items-center text-white text-xl font-semibold cursor-pointer "
            style={{ backgroundColor: bgColor }}
        >
            {props.title}
        </div>
    );
};

export default ProgramCard;
