import React from 'react';

function Button({ text = "Text Here", width = "220px", height = "50px", onClick, isSelected,color="'bg-white text-black border-grey'"}) {
    return (
        <button
            className={`rounded-[10px] font-bold border-2 ${color} ${isSelected ? 'bg-green text-white' : color}`}
            style={{ width: width, height: height }}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;