
import React, { useState } from "react";
import "./Budgetform.css";
import { useNavigate } from "react-router-dom";
import SlideNav from "./SlideNav";

const Budgetform = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    fromDate: "",
    tillDate: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);


    // Validate the form
    if (!formData.name || !formData.amount || !formData.spent) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const newBudget = {
      id: Date.now(), // Unique ID
      ...formData,
      amount: parseFloat(formData.amount),
      spent: parseFloat(formData.spent),
    };

  //   try {
  //     // Save budget to local storage
  //     const savedBudgets = JSON.parse(localStorage.getItem("budgets")) || [];
  //     savedBudgets.push(newBudget);
  //     localStorage.setItem("budgets", JSON.stringify(savedBudgets));
  //     console.log("Budget saved:", newBudget);

  //     // Navigate to budget page
  //     navigate("/budget");
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setErrorMessage("An error occurred while saving the budget.");
  //   }
  // };

    try {
      const response = await fetch("https://finance-tracker-wknd.onrender.com/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Fixed here: change formDate to formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Budget saved:", data);
        navigate("/budget"); // Navigate to the budget page
      } else {
        const errorData = await response.json();
        console.error("Failed to save budget:", errorData);
        setErrorMessage(errorData.error || "Failed to save budget");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while saving the budget.");

    }
    
  };

  const handleClose = () => {
    navigate("/budget");
  };

  return (
    <div className="budget-form-container">
      <SlideNav />
      <button className="close-button" onClick={handleClose}>
        &times;
      </button>
      <div className="budget-form-header">
        <h2>Create Budget</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="budgetName">Budget Name</label>
          <input style={{width:"500px"}}
            type="text"
            id="budgetName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Budget Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Enter Amount</label>
          <input  style={{width:"500px"}}
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter Amount"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="spent">Enter Spent Amount</label>
          <input
            style={{ width: "500px" }}
            type="number"
            id="spent"
            name="spent"
            value={formData.spent}
            onChange={handleChange}
            placeholder="Enter Spent Amount"
            required
          />
        </div>


        <div className="form-dates">
          <div className="form-group">
            <label htmlFor="fromDate">From</label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tillDate">Till</label>
            <input
              type="date"
              id="tillDate"
              name="tillDate"
              value={formData.tillDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default Budgetform;
