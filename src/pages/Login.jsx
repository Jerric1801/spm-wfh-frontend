import { useState } from "react";
import logo_img from "../assets/images/all-in-one_logo2.svg";
import background_img from "../assets/images/login_background.jpg";
import Button from "../components/common/Button";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [error, setError] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();
        
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        //     setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        //     return;
        // }
        
        console.log("Email:", email);
        console.log("Password:", password);
        
        
    };


  return (
    <div className="full-viewport-container flex justify-center items-center relative">
        <img
            src={background_img}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
         />
        <img
            src={logo_img}
            alt="Logo"
            className="absolute top-5 left-5 w-36 h-auto z-10"
        />
        <div className="bg-white p-5 rounded-lg shadow-lg w-96 text-center relative z-10">
            <h1 className="mb-4 items-center justify-center font-Open Sans font-bold text-3xl">
                WFH Schedule
            </h1>
            <h2 className="mb-4 text-center">
                Sign in with your Email
            </h2>
            {/* {error && <p className="mb-4">{error}</p>} */}
            <form onSubmit={handleSubmit} className="mb-10">
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-stroke-grey rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-stroke-grey rounded"
                        required
                    />
                    {/* {error && <div>{error}</div>} */}
                </div>
                <a href="#" className="block mb-4 text-right underline text-tag-blue-dark">
                    Forgot Password?
                </a>
                <Button type="submit" text="Login" width = "300px" height = "50px" />
            </form>
        </div>
    </div>
    );
}

export default Login