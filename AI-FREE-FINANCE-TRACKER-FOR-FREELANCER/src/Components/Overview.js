import React, { useEffect, useState } from 'react';
import './Overview.css';
import SlideNav from './SlideNav.js';
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const navigate = useNavigate();
  const [user, setUserData] = useState(null);
  const [error, setError] = useState(null); // State for error handling
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Retrieve the email from localStorage (from ProfilePage after saving)
  const email = localStorage.getItem("userEmail");

  // Fetch user profile from backend
  useEffect(() => {
    if (!email) {
      setError("Email not found. Please log in or update your profile.");
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile?email=${email}`); // Ensure correct API URL

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        setUserData(data); // Set the fetched user data
        setIsLoading(false); // Turn off loading state
      } catch (err) {
        console.error('Error fetching profile data:', err.message);
        setError('Failed to fetch profile data. Please try again later.');
        setIsLoading(false); // Turn off loading state
      }
    };

    fetchUserData();
  }, [email]);

  // Show loading spinner if data is being loaded
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="account-container">
      <h1 className="account-title">Overview</h1>
      <div className="profile-page">
        <SlideNav />
        <div className="profile-header">
          <img
            src="profile-img.png"
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <p className="profile-text">{user.firstName}</p>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <p className="profile-text">{user.lastName}</p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <p className="profile-text">{user.email}</p>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <p className="profile-text">{user.phoneNumber}</p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <p className="profile-text">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <p className="profile-text">{user.bio}</p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <p className="profile-text">{user.country}</p>
            </div>
            <div className="form-group">
              <label>City/State</label>
              <p className="profile-text">{user.city}</p>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/settings')}
            >
              Back
            </button>
            <button
              type="button"
              className="edit-btn"
              onClick={() => navigate('/profile')}
            >
              <i className="bx bx-edit"></i>Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;//3
