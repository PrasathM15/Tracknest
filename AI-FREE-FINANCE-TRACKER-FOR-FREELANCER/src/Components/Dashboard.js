
import React, { useEffect, useState } from 'react';
import { Line,Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';
import SlideNav from './SlideNav';
import { ImportExport } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';



// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);


const Dashboard = () => {
  const [incomes, setIncomes] = useState([]); // Income data from the backend
  const [loading, setLoading] = useState(true); // Loading state
  const [totalIncome, setTotalIncome] = useState(0); // Total income (in INR)
  const [usdToInrRate, setUsdToInrRate] = useState(1); // USD to INR exchange rate
  const [expenses, setExpenses] = useState([]);
  const[totalAmount,settotalAmount]=useState([0]);
  const [pieChartData, setPieChartData] = useState(null);
  const [Balance,setBalance]= useState(0);
   const [monthlyIncomeData, setMonthlyIncomeData] = useState({ labels: [], totals: [] });
   const location = useLocation();
   const email = location.state?.email;

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/expenses");
      const data = await response.json();
      setExpenses(data.expenses);
      calculateTotalAmount(data.expenses);
      preparePieChartData(data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  const calculateTotalAmount = (expenses) => {
    const total = expenses.reduce((sum, expense) => {
      // Assume each expense contains an expenses array of expense details
      return (
        sum +
        expense.expenses.reduce((subSum, detail) => subSum + detail.amount, 0)
      );
    }, 0);

    settotalAmount(total); // Update the totalAmount state
  };

  const preparePieChartData = (expenses) => {
    const budgetSummary = {};
    expenses.forEach((expense) => {
      const total = expense.expenses.reduce((sum, detail) => sum + detail.amount, 0);
      if (budgetSummary[expense.budgetTitle]) {
        budgetSummary[expense.budgetTitle] += total;
      } else {
        budgetSummary[expense.budgetTitle] = total;
      }
    });

    const labels = Object.keys(budgetSummary);
    const data = Object.values(budgetSummary);

    setPieChartData({
      labels,
      datasets: [
        {
         
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    });
  };

  // Fetch exchange rate for USD to INR
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setUsdToInrRate(data.rates.INR); // Set INR exchange rate
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setUsdToInrRate(1); // Fallback rate
      }
    };

    fetchExchangeRate();
  }, []);

  // Fetch income data from the backend
  useEffect(() => {
    fetchIncomes();
  }, []);

    const fetchIncomes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/incomes'); // Replace with your backend API
        const data = await response.json();
        setIncomes(data); // Store income data

        // Calculate total income in INR
        const total = data.reduce((sum, income) => {
          return sum + (income.currency === 'USD' ? income.amount * usdToInrRate : income.amount);
        }, 0);
        setTotalIncome(total); // Update total income state

         // Process monthly income data
        processMonthlyIncomeData(data);


        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching incomes:', error);
        setLoading(false);
      }
    };

    const processMonthlyIncomeData = (data) => {
      const monthlyData = {};
  
      data.forEach((income) => {
        const date = new Date(income.date);
        const month = date.toLocaleString("default", { month: "short" }); // Get short month name (e.g., "Jan")
        const year = date.getFullYear(); // Include the year to handle multiple years
  
        const key = `${month} ${year}`; // Use "Month Year" as the key
        const amountInINR = income.currency === "USD" ? income.amount * usdToInrRate : income.amount;
  
        if (monthlyData[key]) {
          monthlyData[key] += amountInINR; // Add to the existing total
        } else {
          monthlyData[key] = amountInINR; // Initialize the month's total
        }
      });
  
      const labels = Object.keys(monthlyData);
      const totals = Object.values(monthlyData);
  
      setMonthlyIncomeData({ labels, totals });
    };
  

  // Prepare data for the line chart
  const lineChartData = {
    labels: monthlyIncomeData.labels, // Months as labels
    datasets: [
      {
        label: ' Monthly Income (INR)',
        // data: incomes.map((income) =>
        //   income.currency === 'USD' ? income.amount * usdToInrRate : income.amount
        // ), // Convert income amounts to INR if needed
        // fill: true,
        data: monthlyIncomeData.totals, // Monthly totals
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };
  useEffect(() => {
    setBalance(totalIncome - totalAmount);
  }, [totalIncome, totalAmount]);


  return (
    <div className="dashboard-container">
    
      <SlideNav/>
      {/* <div>
      <h1>Welcome to the Dashboard</h1>
      {email ? (
        <p>Logged in as: {email}</p>
      ) : (
        <p>Email not provided. Please log in again.</p>
      )}
    </div> */}

      {/* Main Content */}
      <div className="content-wrapper">
        <h4 className="account-title1">Dashboard</h4>

        {/* Top Section */}
            
        <div className="top-section">
          <div className="card card-blue">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h2>Your Balance</h2>
              <p className="card-highlight">₹{Balance}</p>
              <p className="subtitle">8% compared with last month</p>
            </div>
          </div>

            <div className="card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Total Income</h3>
              <p className="card-highlight">₹{totalIncome}</p>
              <p className="subtitle">5% compared with last month</p>
            </div>
          </div>
          <div className="card card-yellow">
            <div className="card-icon">💸</div>
            <div className="card-content">
              <h3>Total Expenses</h3>
              <p className="card-highlight">₹{totalAmount}</p>
              <p className="subtitle">2% compared with last month</p>
            </div>
          </div>
        </div>
        </div>
        
        <div className="chart-section">
          <div className="chart-container">
            <h2>Income Money Flow</h2>
            {loading ? <p>Loading chart...</p> : <Line data={lineChartData} />}
          </div>

          {pieChartData ? (
            <Pie
              className='chart-container pie-chart-container'
              data={pieChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: { color: "#333333" },
                  },
                  title: {
                    display: true,
                    text: "Total Expenses by Budget Title",
                    color: "#000000",
                    font: { size: 15, weight: "bold" },
                    padding: { top: 10, bottom: 10 },
                  },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
  );
};

export default Dashboard;
