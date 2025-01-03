// export default Sidebar;
// import React, { useState } from "react";
// import "./Sidebar.css"; // Import the CSS file
// import { FaHome, FaWallet, FaMoneyBillWave, FaFileInvoice, FaBell, FaMoon } from "react-icons/fa";
// import { AiOutlineLogout } from "react-icons/ai";
// import { Link } from 'react-router-dom';
// import { MdAccountCircle, MdOutlineAttachMoney } from "react-icons/md";

// const Sidebar = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     if (!darkMode) {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//   };

//   return (
//     <div className="sidebar">
//       <div className="logo">
//       <img src= "tnimage.png" alt="TrackNest Logo"
//       style={{ width: '200px', height: 'auto', margin: '0 auto' }}  />
//       </div>
//       <ul className="nav-links">
//         <li>
//           <FaHome className="icon" />
//           <span>Dashboard</span>
//         </li>
//         <li className="active">
//           <MdOutlineAttachMoney className="icon" />
//          <span>
//           <Link to="/income">Income</Link>
//         </span>
//         </li>
//         <li>
//           <FaWallet className="icon" />
//           <span>
//           <Link to="/budget">Budget</Link>
//           </span>
//         </li>
//         <li>
//           <FaMoneyBillWave className="icon" />
//           <span>Expenses</span>
//         </li>
//         <li>
//           <FaMoneyBillWave className="icon" />
//           <span>Tax</span>
//         </li>
//         <li>
//           <FaFileInvoice className="icon" />
//           <span>Invoice</span>
//         </li>
//         <li>
//           <FaBell className="icon" />
//           <span>Notifications</span>
//           <span className="notification-count">6</span>
//         </li>
//         <li>
//           <MdAccountCircle className="icon" />
//           <span>Account</span>
//         </li>
//         <li className="dark-mode-toggle">
//           <FaMoon className="icon" />
//           <span>Dark Mode</span>
//           <input
//             type="checkbox"
//             onChange={toggleDarkMode}
//             checked={darkMode}
//             className="toggle-button"
//           />
//         </li>
//       </ul>
//       <div className="logout">
//         <AiOutlineLogout className="icon" />
//         <span>Logout</span>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

