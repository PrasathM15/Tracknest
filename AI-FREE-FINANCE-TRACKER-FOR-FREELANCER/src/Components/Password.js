import React, { useState, useEffect } from 'react';
import './Password.css';
import SlideNav from './SlideNav.js';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";

const Password = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage
    const firstName = localStorage.getItem('userFirstName');
    const lastName = localStorage.getItem('userLastName');
    const email = localStorage.getItem('userEmail');

    if (firstName && lastName && email) {
      setUserData({ firstName, lastName, email });
    }
  }, []);

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill out all fields to update the password.');
      return;
    }

    // Validation for password match
    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password do not match.');
      return;
    }

    // Reset error message and show success popup
    setError('');
    setShowPopup(true);

    // Clear the form fields after showing the popup
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Hide the popup after 3 seconds and navigate to /settings
    setTimeout(() => {
      setShowPopup(false);
      navigate('/settings');  // Redirect to the /settings page
    }, 3000);
  };

  return (
    
    <div className="account-container1">
      <h1 className="account-title4">Security</h1>
      <div className="profile-page1">
        <SlideNav />
        <div className="profile-header1">
          <img
            src="profile-img.png"
            alt="Profile"
            className="profile-image1"
          />
          <div className="profile-info1">
            <h2>{userData.firstName} {userData.lastName}</h2>
            <p>{userData.email}</p>
          </div>
        </div>
        <form className="profile-form1" onSubmit={handleUpdatePassword}>
          <div className="form-row1">
            <div className="form-group1">
              <label>Email</label>
              <span>{userData.email}</span>
            </div>
            <div className="form-group1">
              <label>Old Password</label>
              <div className="input-with-icon1">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={{ borderColor: error && !oldPassword ? 'red' : '' }}
                />
                <button
                  type="button"
                  className="icon-button1"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
            </div>
          </div>
          <div className="form-row1">
            <div className="form-group1">
              <label>New Password</label>
              <div className="input-with-icon1">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ borderColor: error && (!newPassword || error.includes('do not match')) ? 'red' : '' }}
                />
                <button
                  type="button"
                  className="icon-button1"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
            </div>
            <div className="form-group1">
              <label>Confirm Password</label>
              <div className="input-with-icon1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ borderColor: error && (!confirmPassword || error.includes('do not match')) ? 'red' : '' }}
                />
                <button
                  type="button"
                  className="icon-button1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
            </div>
          </div>
          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
          <div className="form-actions1">
            <button type="button" className="cancel-btn1" onClick={() => navigate('/settings')}>Cancel</button>
            <button type="submit" className="save-btn1">Update Password</button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="popup1">
          Password updated successfully!
        </div>
      )}
    </div>
  );
};

export default Password; 