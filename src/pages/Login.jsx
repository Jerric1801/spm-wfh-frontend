import { React, useState } from "react";
import logo_img from "../assets/images/all-in-one_logo2.svg";
import background_img from "../assets/images/login_background.jpg";
import Button from "../components/common/Button";

function Login() {
    const [emailOrId, setEmailOrId] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Clear previous error messages
        setErrors([]);
        setIsLoading(true);
        
        // Email: must end with @allinone.com + a valid domain name like .sg, .hk or .id
        const domains = ['sg', 'hk', 'id', 'my', 'vn']; // Add all your domain endings here
        const domainPattern = domains.join('|');
        const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@allinone\\.com\\.(?:${domainPattern})$`);
        
        // Employee ID: must be a 6 digit number
        const idRegex = /^\d{6}$/;
        
        // Store Error Messages
        const newErrors = [];
    
        if (!emailOrId) {
            newErrors.push("Please enter your Email or Employee ID.");
        } else if (!emailRegex.test(emailOrId) && !idRegex.test(emailOrId)) {
            newErrors.push("Please enter a valid company email or employee ID.");
        }
    
        if (!password) {
            newErrors.push("Please enter your password.");
        }
    
        if (newErrors.length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }
    
        // Simulate a longer loading time (e.g., API call)
        setTimeout(() => {
            console.log("Email/ID:", emailOrId);
            console.log("Password:", password);
            setIsLoading(false);
        }, 2000); // 2 seconds
    };

    return (
        <div className="w-full h-full flex justify-center items-center relative p-4 md:p-0">
            <img
                src={background_img}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
            <img
                src={logo_img}
                alt="Logo"
                className="absolute top-5 left-5 w-24 h-auto md:w-36 z-10"
            />
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl relative p-10 md:p-10 font-os z-10">
                <h1 className="mb-4 font-bold text-2xl text-center md:text-3xl">
                    WFH Tracking System
                </h1>
                <p className="mb-4 text-base md:text-base text-left">
                    Sign in with your company Email or Employee ID
                    <br />
                    e.g.
                    <ul className="list-disc list-inside">
                        <li>Email: johndoe@allinone.com.sg</li>
                        <li>ID: 140123</li>
                    </ul>
                </p>
                <form onSubmit={handleSubmit} className="">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Email or Employee ID"
                            value={emailOrId}
                            onChange={(e) => setEmailOrId(e.target.value)}
                            className={`w-full p-2 border ${errors.some(error => error.toLowerCase().includes("email")) ? "border-red-500" : "border-stroke-grey"} rounded`}
                        />
                        {errors.filter(error => error.toLowerCase().includes("email")).map((error, index) => (
                            <p key={index} className="text-red-500">{error}</p>
                        ))}
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full p-2 border ${errors.some(error => error.toLowerCase().includes("password")) ? "border-red-500" : "border-stroke-grey"} rounded`}
                        />
                        {errors.filter(error => error.toLowerCase().includes("password")).map((error, index) => (
                            <p key={index} className="text-red-500">{error}</p>
                        ))}
                    </div>
                    <div className="mb-4 text-right underline text-tag-blue-dark">
                        <a href="#">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" text={isLoading ? "Loading..." : "Login"} width="60%" height="50px" disabled={isLoading} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
