import React, { useEffect, useState } from "react";
import "./SettingsPage.css";
import SlideNav from './SlideNav.js';
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();

  // State to store user information
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Fetch data from localStorage
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      // Assuming you have user data available in localStorage
      // You could also fetch more details from the backend if needed
      setUser({
        firstName: localStorage.getItem('userFirstName'),
        lastName: localStorage.getItem('userLastName'),
        email: email,
      });
    } else {
      console.log('No user data found.');
    }
  }, []);

  return (
    <div className="settings-page">
      <SlideNav />
      
      {/* Header Section */}
      <div className="settings-header">
        <h2>Account</h2>
        
      </div>

      {/* Account Section */}
      <div className="settings-section">
        <div className="account-section">
          <div className="account-card">
            <img
              src="profile-img.png"
              alt="Profile"
              className="profile-img"
            />
            <div className="account-info">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
            </div>
            <button
              className="edit-profile-btn"
              onClick={() => navigate('/profile')} // Navigate to ProfilePage
            >
              <i className="bx bx-edit"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="settings-section">
        <h2>Security</h2>
        <div className="security-section">
          <div className="security-card">
            <div className="security-image">
              <img src="sec.png" alt="Security" />
            </div>
            <div className="security-info">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
            </div>
            <button
              className="change-password-btn"
              onClick={() => navigate('/password')} // Navigate to ChangePasswordPage
            >
              <i className="bx bx-edit"></i> Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;//3