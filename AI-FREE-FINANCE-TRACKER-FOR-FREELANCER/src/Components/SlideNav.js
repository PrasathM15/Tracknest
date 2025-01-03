import React, { useState, useEffect } from 'react';
import './slidenav.css';
import 'boxicons/css/boxicons.min.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    // Fetch user data from localStorage
    const firstName = localStorage.getItem('userFirstName');
    const lastName = localStorage.getItem('userLastName');

    if (firstName && lastName) {
      setUserData({ firstName, lastName });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

      <div className="logo_details">
        <i className="bx bxl-audible icon"></i>
        <div className="logo_name">TrackNest</div>
      </div>
      <ul className="nav-list">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-grid-alt"></i>
            <span className="link_name">Dashboard</span>
            <span className="tooltip">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/income" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-money"></i>
            <span className="link_name">Income</span>
          </NavLink>
          <span className="tooltip">Income</span>
        </li>
        <li>
          <NavLink to="/budget" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-wallet"></i>
            <span className="link_name">Budget</span>
          </NavLink>
          <span className="tooltip">Budget</span>
        </li>
        <li>
          <NavLink to="/expense" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-line-chart-down"></i>
            <span className="link_name">Expense</span>
          </NavLink>
          <span className="tooltip">Expense</span>
        </li>
        <li>
          <NavLink to="/tax" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-bookmark-alt"></i>
            <span className="link_name">Tax</span>
          </NavLink>
          <span className="tooltip">Tax</span>
        </li>
        <li>
          <NavLink to="/invoice" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-file-blank"></i>
            <span className="link_name">Invoice</span>
          </NavLink>
          <span className="tooltip">Invoice</span>
        </li>
        <li>
          <NavLink to="/notification" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-bell"></i>
            <span className="link_name">Notification</span>
          </NavLink>
          <span className="tooltip">Notification</span>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "slidenav-link active" : "slidenav-link"}>
            <i className="bx bx-cog"></i>
            <span className="link_name">Settings</span>
          </NavLink>
          <span className="tooltip">Settings</span>
        </li>
        <li className="profile">
          <div className="profile_details">
            <img src="profile-img.png" alt="profile" />
            <div className="profile_content">
              <div className="name">{userData.firstName} {userData.lastName}</div>
              <div className="designation">User</div>
            </div>
          </div>
          <i className="bx bx-log-out" id="log_out" onClick={() => navigate('/landing')}></i>
        </li>
      </ul>
    </div>
  );
};

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src="Group.png" alt="logo" className="navbar-logo" />
        <i className="bx bx-menu hamburger-icon" onClick={toggleSidebar}></i> {/* Hamburger Icon */}
        
        <div className="search-container">
          <i className="bx bx-search"></i> 
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="navbar-right">
        <div className="notification">
          <i className="bx bx-bell"></i>
          <span className="notification-count">6</span>
        </div>
        <div className="profile-icon">
          <img src="profile-img.png" alt="profile" />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // Toggle the sidebar state
  };

  return (
    <div>
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default App;
