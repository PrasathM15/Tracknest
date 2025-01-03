
import React, { useEffect, useState } from "react";
import './Budget.css';
import { useNavigate } from 'react-router-dom';
import SlideNav from "./SlideNav";

const Budget = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]); // To store budget data
  // const [expenses, setExpenses] = useState([]); // To store expense data
  // const [budgetDetails, setBudgetDetails] = useState([]); // Merged budget and expense data with progress calculation

  // Fetch budgets from API
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("https://finance-tracker-wknd.onrender.com/api/budgets");
        const data = await response.json();
        const fetchedBudgets = data.budgets || [];

        // Add `progress` calculation for each budget based on the fetched data
        const budgetsWithProgress = fetchedBudgets.map((budget) => ({
          ...budget,
          spent: budget.spent || 0, // Use `spent` if it exists; default to 0
          progress:
            budget.amount > 0
              ? Math.min((budget.spent / budget.amount) * 100, 100)
              : 0, // Calculate progress percentage
        }));

        setBudgets(budgetsWithProgress);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };
    fetchBudgets();
  }, []);

  
  return (
    <div className="budget-page">
      <SlideNav/>
      <h1>Budgets</h1>
      {/* Create New Budget Card */}
      <div
        className="budget-card create-new"
        onClick={() => navigate('/create-budget')}
        style={{ cursor: 'pointer' }}
      >
        <h2>+ Create New Budget</h2>
      </div>

      {/* Render Budget Cards */}
      <div className="budget-cards">
         {budgets.map((budget) => (
          <div key={budget.id} className="budget-card">
            <h3>{budget.name}</h3>
            <div className="budget-amount">
              <span>Total: ₹{budget.amount}</span>
              <span>Spent: ₹{budget.spent || 0}</span> {/* spent amount*/}
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${budget.progress ?(budget.spent / budget.amount) * 100 : 0}%`,
            backgroundColor: budget.progress >= 100 ? "red" : "#3546AB", // Change color if exceeded,
          }}
        ></div>
      </div>
    </div>
  ))}
</div>
</div>
   
  );
};

export default Budget;

