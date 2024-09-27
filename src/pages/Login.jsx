import { useState } from "react";
import { useNavigate } from 'react-router-dom';
// import { userLogin } from "../services/endpoints/auth"; // (not yet ready)

// components
import logo_img from "../assets/images/all-in-one_logo2.svg";
import background_img from "../assets/images/login_background.jpg";
import Button from "../components/common/Button";

// dummy data
import userData from '../data/auth/user.json'; 

// Simulate userLogin
const userLogin = async (emailOrId, password) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate invalid credentials Error
        if (emailOrId === "000001") {
            throw { response: { data: { message: "Invalid Email/Employee ID or password" } } };
        // No response Error
        } else if (emailOrId === "000002") {
            throw { request: {} };
        // Network Error
        } else if (emailOrId === "000003") {
            throw new Error("Network error");
        }

        // Simulate authentication process
        const user = userData.find(user => 
            (user.email === emailOrId || user.employeeId === emailOrId) && user.password === password
        );

        if (user) {
            const token = "fake-jwt-token";
            localStorage.setItem('token', token);
            // document.cookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;

            console.log('User details:', user);
            console.log('jwt-token:', token);

            return { success: true, message: "Login is successful", token };
        }

    } catch (error) {
        if (error.response) {
            console.error('Login error:', error.response.data.message);
            return { success: false, message: error.response.data.message };
        } else if (error.request) {
            console.error('Login error: No response received');
            return { success: false, message: 'No response received' };
        } else {
            console.error('Login error:', error.message);
            return { success: false, message: error.message };
        }
    }
};

// Utility function
const validateInputs = (emailOrId, password) => {
    const newErrors = [];
    const domains = ['sg', 'hk', 'id', 'my', 'vn'];
    const domainNames = domains.join('|');

    // user email must end with @allinone.com. + a domain name
    const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@allinone\\.com\\.(?:${domainNames})$`);

    // Employee ID must be a 6 digit number
    const idRegex = /^\d{6}$/; 

    if (!emailOrId) {
        newErrors.push("Please enter your Email or Employee ID.");
    } else if (!emailRegex.test(emailOrId) && !idRegex.test(emailOrId)) {
        newErrors.push("Please enter a valid company Email or Employee ID.");
    }

    if (!password) {
        newErrors.push("Please enter your password.");
    }

    return newErrors;
};

// Utility function
const loginWithTimeout = (emailOrId, password, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Request timed out"));
        }, timeout);

        userLogin(emailOrId, password)
            .then((result) => {
                clearTimeout(timer);
                resolve(result);
            })
            .catch((error) => {
                clearTimeout(timer);
                reject(error);
            });
    });
};

// Main Function
function Login() {
    const [emailOrId, setEmailOrId] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleLoginError = (message) => {
        setErrors([message]);
    };

    const handleNetworkError = (error) => {
        setErrors([error.message]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setIsLoading(true);
        setSuccessMessage("");

        const validationErrors = validateInputs(emailOrId, password);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }
    
        try {
            const result = await loginWithTimeout(emailOrId, password);
            if (result.success) {
                setSuccessMessage(result.message);
                setTimeout(() => {
                    navigate("/"); // Redirect to dashboard after 3 seconds
                }, 3000);
            } else {
                handleLoginError(result.message);
            }
        } catch (error) {
            handleNetworkError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center relative p-4 md:p-0">
            {/* Background Image */}
            <img
                src={background_img}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
            {/* Logo */}
            <img
                src={logo_img}
                alt="Logo"
                className="absolute top-5 left-5 w-24 h-auto md:w-36 z-10"
            />
            {/* Login Form */}
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl relative p-10 md:p-10 font-os z-10">
                <h1 className="mb-4 font-bold text-2xl text-center md:text-3xl">
                    WFH Tracking System
                </h1>
                <div className="mb-4 text-base md:text-base text-left">
                    Sign in with your company Email or Employee ID
                    <br />
                    e.g.
                    <ul className="list-disc list-inside">
                        <li>Email: johndoe@allinone.com.sg</li>
                        <li>ID: 140123</li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit} className="">
                    {/* Email/Employee ID Input */}
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
                    {/* Password Input */}
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
                    {/* Forgot Password */}
                    <div className="mb-4 text-right underline text-tag-blue-dark">
                        <a href="#">
                            Forgot Password?
                        </a>
                    </div>
                    {/* Login Button */}
                    <div className="flex justify-center">
                        <Button type="submit" text={isLoading ? "Loading..." : "Login"} width="60%" height="50px" disabled={isLoading} />
                    </div>
                    {/* Successful Login Message */}
                    <div className="bg-green justify-center">
                        {successMessage && <div className="text-center text-white">{successMessage}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
