

import React, { useState } from 'react';
import './Form.css'; // Import CSS
import SlideNav from './SlideNav';
import { useNavigate } from 'react-router-dom';

const Incomeform = () => {
  const [companyName, setCompanyName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR'); // Default currency
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newIncome = {
      companyName,
      amount: parseFloat(amount), // Convert amount to a number
      currency,
      date,
    };

    try {
      const response = await fetch('http://localhost:5000/api/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIncome),
      });
      
      if (response.ok) {
        navigate('/income'); // Navigate back to Incomepage
      } else {
        console.error('Failed to add income');
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }

    // Reset form fields
    setCompanyName('');
    setAmount('');
    setCurrency('INR');
    setDate('');
  };

  const handleClose = () => {
    navigate('/income'); // Navigate back to Incomepage
  };

  return (
    <div className="modal-overlay">
      <SlideNav />
      <div className="income-form-container">
        <div className="income-form">
          <h2>Add Income</h2>
          <button className="close-button-income" onClick={handleClose}>
            ✖ 
          </button>
          <form onSubmit={handleSubmit}>
            <div className="form-group ">
              <label htmlFor="companyName">Company Name</label>
              <input 
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="amount-group">
              <label htmlFor="amount">Amount</label>
              <div className="currency-input"> {/* Container for input and dropdown */}
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
                {/* Add more currencies as needed */}  </select>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
              </div>
            </div>
            {/* <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div> */}
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="buttoncontainer">
              <button className="createincome" type="submit">Create Income</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default Incomeform;
