


import './Login.css';
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
//import axios from "axios";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);


      useEffect(() => {
      const fetchUserDetails = async () => {
        if (email) {
          try {
            const response = await fetch(`https://finance-tracker-wknd.onrender.com/login?email=${email}`);
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.message || "Email or password incorrect");
            }
            setUserDetails(data.user); // Store fetched user details
            setMessage(""); // Clear any existing error messages
          } catch (error) {
            setMessage(error.message || "Email not found or incorrect password");
            setUserDetails(null); // Reset user details if login fails
          }
        }
      };

      fetchUserDetails();
      }, [email]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
        setMessage("Please provide both email and password.");
        return;
    }

    if (userDetails) {
      if (userDetails.password === password) {
        setMessage("Login successful!");
        navigate("/Dashboard", { state: { email } });
      } else {
        setMessage("Incorrect password.");
      }
    } else {
      setMessage("Email not found. Please try again.");
    }
};


  return (
    <div className="login-page">
      <div className="left-section">
        <h1>Log in</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input type="email" placeholder="Your email" className="input-field"
           required
           value={email}
           onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-container">
            <input 
              type={passwordVisible ? "text" : "password"} // Toggle password visibility
              placeholder="Password" 
              className="input-field"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span 
              className="eye-icon" 
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button className="login-button">Log In</button>
          <a href="/email" className="forgot-password">Forgot password?</a>
          <div className="divider">or</div>
          <div className="social-buttons">
            <button className="social-button google">
            <img src="google_icon.png" alt="Icon" className="btn-icon" />
              Google</button>
            <button className="social-button facebook">
            <img src="facebook_icon.png" alt="Icon" className="btn-icon" />
              Facebook</button>
          </div>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
          <b><p>{message && <span className="error-message">{message}</span>}</p></b>
        </form>
      </div>
      <div className="right-section">
      <img src="login-left-box.jpg" alt="TrackNest_Visualization" className="right-image" />
      </div>
    </div>
  );
}
export default Login;
