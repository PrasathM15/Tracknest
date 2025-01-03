
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Incomepage.css';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import SlideNav from './SlideNav';


 


const Incomepage = () => {
  const [incomes, setIncomes] = useState([]); // State to store income data
  const [loading, setLoading] = useState(true); // For loading state
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount
  const [usdToInrRate, setUsdToInrRate] = useState(1); // USD to INR exchange rate
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD'); // Exchange rate API
        const data = await response.json();
        setUsdToInrRate(data.rates.INR); // Set the INR rate from the response
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setUsdToInrRate(1); // Fallback rate if the API fails
      }
    };
    
    fetchExchangeRate();
  }, []);

  // Fetch incomes from the backend
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch('https://finance-tracker-wknd.onrender.com/api/incomes'); // API endpoint
        const data = await response.json();
        setIncomes(data); // Set the fetched data to state
       
        const total = data.reduce((sum, income) => sum + income.amount, 0);
        setTotalAmount(total); // Set total amount to state

        setLoading(false);
      } catch (error) {
        console.error('Error fetching incomes:', error);
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []); // Fetch data on component mount

  useEffect(() => {
    let total = 0;
    incomes.forEach((income) => {
      if (income.currency === 'USD') {
        total += income.amount * usdToInrRate; // Convert USD to INR
      } else {
        total += income.amount; // If already INR, no conversion
      }
    });
    setTotalAmount(total);
  }, [incomes, usdToInrRate]); // Recalculate whenever incomes or the exchange rate change


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Income Transactions', 20, 20);

    // Add table headers
    let y = 30;
    doc.text('ID', 20, y);
    doc.text('Company Name', 50, y);
    doc.text('Amount', 100, y);
    doc.text('Currency', 140, y);
    doc.text('Date', 180, y);

    // Add table rows
    incomes.forEach((income, index) => {
      y += 10;
      doc.text((index + 1).toString(), 20, y);
      doc.text(income.companyName, 50, y);
      doc.text(income.amount.toString(), 100, y);
      doc.text(income.currency, 140, y);
      doc.text(new Date(income.date).toLocaleDateString(), 180, y);
    });

    // Save the file
    doc.save('income-transactions.pdf');
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(incomes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Incomes');
    XLSX.writeFile(workbook, 'income-transactions.xlsx');
  };

  return (
    <div className="income-page-container">
      <SlideNav/>
      <div>
        <h1>Income</h1>
      
          <button className="create-income-button" onClick={() => navigate('/incomecreate')}>+ Add Income</button>
        <div className="export-container">
          <button className="export-button">Export</button>
          <div className="dropdown">
            <button onClick={exportToExcel}> Excel</button>
            <button onClick={exportToPDF}> PDF</button>
          </div>
         {/* Export Button with Dropdown */}
      </div>
        <h2>Recent Transactions </h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : incomes.length === 0 ? (
          <p>There is no data found</p>
        ) : (
          <>
          <table className="income-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company Name</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income, index) => (
                <tr key={income._id}>
                  <td>{index + 1}</td>
                  <td>{income.companyName}</td>
                  <td>{income.amount}</td>
                  <td>{income.currency}</td>
                  <td>{new Date(income.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
           {/* Display Total Amount */}
           <div className="total-amount">
           <strong>Total Amount: </strong>₹{totalAmount.toFixed(2)}
         </div>
         </>
        )}
    </div>
  </div>
  );
};

export default Incomepage;
