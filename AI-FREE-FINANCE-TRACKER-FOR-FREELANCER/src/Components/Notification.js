import React from "react";
import "./Notification.css"; // Import the corresponding CSS for styling
import SlideNav from './SlideNav.js';
const notifications = [
  {
    date: "Today",
    items: [
      {
        title: "Invoice Paid",
        
        description: "Invoice #1023 for ₹15,000 has been marked by you",
        status: "Paid",
        icon: "📄", // Replace with actual icons (e.g., from FontAwesome)
      },
      {
        title: "Tax Calculation Updated",
       
        description:
          "Based on your new income, estimated taxes for this month are ₹12,000.",
        status: "Updated at 9:01am",
        icon: "🧾",
      },
      {
        title: "Welcome!",
        
        description:
          "Welcome to your Personal Finance Tracker. Let’s set up your first budget!",
        status: "Last Updated at 9:01am",
        icon: "👋",
      },
    ],
  },
  {
    date: "Today",
    items: [
      {
        title: "System Update",
        
        description:
          "Your data has been backed up successfully on December 4th.",
        status: "Last Updated at 9:01am",
        icon: "🔧",
      },
      {
        title: "Invoice Paid",
        
        description:
          "Invoice #1023 for ₹15,000 has been marked as paid by the client.",
        status: "Paid",
        icon: "📄",
      },
    ],
  },
];

const NotificationCard = ({ title, description, status, icon }) => {
    return (
      <div className="notification-card">
        <div className="notification-icon">{icon}</div>
        <div className="notification-content">
          <div className="notification-header">
            <div className="notification-header-title-description">
              <span className="notification-title">{title}</span>
              <span className="notification-description">{description}</span>
            </div>
            <div className="notification-time-status">
              <p className="notification-status">{status}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
const Notifications = () => {
  return (
    <div className="notifications-container">
        <SlideNav />
      <h1 className="notifications-title">Notifications</h1>
      {notifications.map((section, index) => (
        <div key={index} className="notification-section">
          <h2 className="notification-date">{section.date}</h2>
          {section.items.map((item, idx) => (
            <NotificationCard key={idx} {...item} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
