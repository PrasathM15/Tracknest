// import React from "react";
// import { FaBars, FaBell } from "react-icons/fa";

// const Header = () => {
//   return (
//     <div style={styles.container}>
//       {/* Hamburger Menu */}
//       <FaBars style={styles.icon} />

//       {/* Search Bar */}
//       <input type="text" placeholder="Search" style={styles.searchBar} />

//       {/* Notification Bell with Badge */}
//       <div style={styles.notification}>
//         <FaBell style={styles.icon} />
//         <span style={styles.badge}>6</span>
//       </div>

//       {/* User Avatar */}
//       <div style={styles.avatar}>
//         <img
//           src="https://via.placeholder.com/32" // Replace with your avatar image URL
//           alt="User Avatar"
//           style={styles.avatarImg}
//         />
//       </div>
//     </div>
//   );
// };

// // Inline styles
// const styles = {
//   container: {
//     position: "absolute", // Makes the bar fixed at the top
//     top: "0px", // Aligns it to the very top
//     left: "250px", // Stretches from the left
//     width: "100%", // Ensures the bar spans the full width
//     zIndex: 1000, // Ensures it stays above other elements
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     padding: "10px 20px",
//     backgroundColor: "#f9f9f9",
//     borderBottom: "1px solid #e0e0e0",
//     boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
//   },
  
//   searchBar: {
//     flex: 1,
//     width: "300px", /* Customize the width of the search bar */
//     margin: "0 20px",
//     padding: "8px 12px",
//     border: "1px solid #ccc",
//     borderRadius: "6px",
//     fontsize: "14px",
//     outline: "none",
//     maxWidth: "550px", // Set a max width to control the search bar's size
//     fontSize: "14px", // Reduce the font size for a compact look
//   },
//   rightSection: {
//     display: "flex",
//     alignItems: "center",
//     gap: "15px", // Adds spacing between bell and avatar
//   },
//   icon: {
//     fontSize: "20px",
//     color: "#555",
//     cursor: "pointer",
//   },
//   notification: {
//     position: "relative",
//     left: "500px",
//     cursor: "pointer",
//   },
//   badge: {
//     position: "absolute",
//     top: "-5px",
//     right: "-5px",
//     background: "#ff3b30",
//     color: "#fff",
//     fontSize: "10px",
//     borderRadius: "50%",
//     padding: "2px 6px",
//   },
//   avatarImg: {
//     width: "32px",
//     height: "32px",
//     left: "2500px",
//     borderRadius: "50%",
//     border: "1px solid #ddd",
//   },
// };

// export default Header;
