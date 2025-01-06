import { useNavigate } from "react-router-dom";
import SlideNav from "./SlideNav.js";
import { CiFilter } from "react-icons/ci";
import './expense.css';
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

export default function Expense() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  //filter usestate
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [budgetTitle, setBudgetTitle] = useState("");
  const [amount, setAmount] = useState("");
    // State to store total amount
    const [totalAmount, setTotalAmount] = useState(0);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredTotalAmount, setfilteredTotalAmount] = useState(0); // Total of filtered expenses

    // Calculate total amount
    const calculateTotalAmount = (expenses) => {
      return expenses.reduce((total, expense) => {
        return total + expense.expenses.reduce((sum, expenseDetail) => {
          return sum + expenseDetail.amount;
        }, 0);
      }, 0);
    };
  //const [totalAmount, setTotalAmount] = useState(0);


  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/expenses");
      const data = await response.json();
      setExpenses(data.expenses);
     
      setTotalAmount(calculateTotalAmount(data.expenses));
      
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const applyFilters = async () => {
    try {
      const query = new URLSearchParams();
      if (fromDate) query.append("fromDate", fromDate);
      if (toDate) query.append("toDate", toDate);
      if (budgetTitle) query.append("budgetTitle", budgetTitle);
      if (amount) query.append("amount", amount);

      const response = await fetch(`http://localhost:5000/api/expenses?${query.toString()}`
      );
      const data = await response.json();
      // Calculate and update total amount for filtered expenses
      //update here
    const filteredAmount = calculateTotalAmount(data.expenses);
   //made changes here
    setfilteredTotalAmount(data.filteredTotalAmount);

    // You can also update total amount for the entire set of expenses
    // if needed, though it will not change after filter is applied
    setTotalAmount(data.totalAmount);
 //update here
      setExpenses(data.expenses);
      //setFilteredExpenses(data.filteredExpenses);
      //const filteredTotalAmount = calculateTotalAmount(data);
      //setfilteredTotalAmount(data.filteredTotalAmount);
      
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setBudgetTitle("");
    setAmount("");
   // Close the filter panel after resetting the filters
   setShowFilters(false);
   
    fetchExpenses();
    setfilteredTotalAmount(0);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 20, 20);

    const headers = [["Budget Title", "Expense Name", "Amount", "Date"]];
    const data = expenses.flatMap((expense) =>
      expense.expenses.map((detail) => [
        expense.budgetTitle,
        detail.expenseName,
        detail.amount,
        detail.date.split("T")[0],
      ])
    );

    doc.autoTable({
      startY: 30,
      head: headers,
      body: data,
    });

    doc.save("Expense_Report.pdf");
  };

  const exportToExcel = () => {
    const data = expenses.flatMap((expense) =>
      expense.expenses.map((detail) => ({
        "Budget Title": expense.budgetTitle,
        "Expense Name": detail.expenseName,
        Amount: detail.amount,
        Date: detail.date.split("T")[0],
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "Expense_Report.xlsx");
  };
  return (
    <div className="expense_maindiv">
      
      <SlideNav />
      <h1 style={{ marginLeft: '280px' , marginTop:'20px'}}>My Expenses</h1>

      <div className="threebuttons">
        <button className="filterbutton" onClick={toggleFilters}>
          <CiFilter className="buttonicon" />
          Filter
        </button>

      {showFilters && (
        <div className="filter_ui">
          <div className="filter_group">
            <label>From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="filter_group">
            <label>To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="filter_group">
            <label>Budget Title:</label>
            <input
              type="text"
              value={budgetTitle}
              onChange={(e) => setBudgetTitle(e.target.value)}
              placeholder="Enter Budget Title"
            />
          </div>
          <div className="filter_group">
            <label>Amount (e.g., 1000):</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount filter"
            />
          </div>
          <div className="filter_actions">
            <button className="applybutton" onClick={applyFilters}>
              Apply
            </button>
            <button className="resetbutton" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      )}
        <button onClick={() => navigate('/expenseform')} className="addexpensebutton">
          <AiOutlinePlus className="buttonicon" />
          Add Expense
        </button>
        <div className="dropdown_div">
          <button className="exportbutton" onClick={toggleDropdown}>
            Export Data
          </button>
          {showDropdown && (
            <div className="dropdownmenu_export ">
              <button onClick={exportToPDF}>Export to PDF</button>
              <button onClick={exportToExcel}>Export to Excel</button>
            </div>
          )}
        </div>
      </div>
      <div className="table-wrapper" style={{ marginBottom:"200px"}}>
        <table>
          <thead>
            <tr>
              <th>Budget Title</th>
              <th>Expense Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) =>
              expense.expenses.map((expenseDetail, idx) => (
                <tr key={idx}>
                  <td>{expense.budgetTitle}</td>
                  <td>{expenseDetail.expenseName}</td>
                  <td>{expenseDetail.amount}</td>
                  <td>{expenseDetail.date.split("T")[0]}</td>
                  <td>
                    {expenseDetail.attachment && (
                      <a
                        href={`http://localhost:5000/uploads/${expenseDetail.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Attachment
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="totalamount">
          <strong>Total Amount: </strong>
          {totalAmount}
        </div>
        <div className="filtered-total-amount">
          <strong>Total Amount (Filtered Expenses): </strong>
          {filteredTotalAmount} {/* Shows total amount of filtered expenses */}
        </div>
        

      </div>
    </div>
  );
}








  