import React from 'react';

function Button({ text = "Text Here", width = "220px", height = "50px", onClick, isSelected }) {
    return (
        <button
            className={`rounded-[10px] font-bold border-2 ${isSelected ? 'bg-green text-white' : 'bg-white text-black border-grey'}`}
            style={{ width: width, height: height }}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;