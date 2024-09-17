function Button({ text = "Text Here", width = "220px", height = "50px", onClick  }) {
    return(
        <button 
            className="bg-green text-white rounded-[10px] font-bold" 
            style={{ width: width, height: height }}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button;