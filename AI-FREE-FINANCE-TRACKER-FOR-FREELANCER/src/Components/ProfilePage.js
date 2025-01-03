import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideNav from './SlideNav.js';
import './ProfilePage.css'; // External CSS for the rest of the page

const ProfilePage = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: '',      
    lastName: '',
    dateOfBirth: '',
    bio: '',
    country: 'India',
    city: '',
    email: '',
    phoneNumber: '',
  });

  // State for showing success message
  const [showMessage, setShowMessage] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://finance-tracker-wknd.onrender.com/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userFirstName", data.firstName); // Save firstName
        localStorage.setItem("userLastName", data.lastName); // Save lastName
        localStorage.setItem("userEmail", data.email); // Store email in localStorage
        
        // Show success message
        setShowMessage(true);
        
        // Wait for 3 seconds, then navigate to Overview
        setTimeout(() => {
          setShowMessage(false); // Hide the success message
          navigate('/overview'); // Navigate to OverviewPage
        }, 3000);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="account-container2">
      <h1 className="account-title2">Edit Profile</h1>
      <div className="profile-page2">
        <SlideNav />

        <div className="profile-header2">
          <img
            src="profile-img.png"
            alt="Profile"
            className="profile-image2"
          />
          <div className="profile-info2">
            <h2>{formData.firstName} {formData.lastName}</h2>
            <p>{formData.email}</p>
          </div>
        </div>

        <form className="profile-form2" onSubmit={handleSubmit}>
          <div className="form-row2">
            <div className="form-group2">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="eg: Tharun"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group2">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="eg: Kumar"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row2">
            <div className="form-group2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="eg: Tharun@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group2">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="eg: 9568456214"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row2">
            <div className="form-group2">
              <label>Date Of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-group2">
              <label>Bio</label>
              <input
                type="text"
                name="bio"
                placeholder="eg: UI/UX Designer"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row2">
            <div className="form-group2">
              <label>Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
            <div className="form-group2">
              <label>City/State</label>
              <input
                type="text"
                name="city"
                placeholder="Chennai, Tamil Nadu"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions2">
            <button
              type="button"
              className="cancel-btn2"
              onClick={() => navigate('/settings')}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn2">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Success Message (Pop-up at bottom-center) */}
      {showMessage && (
        <div style={styles.successMessage}>
          Profile updated successfully!
        </div>
      )}
    </div>
  );
};

const styles = {
  successMessage: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#3E3FD8',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    display: 'inline-block',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    animation: 'fadeInOut 3s ease-in-out forwards',
  },
};

export default ProfilePage;
