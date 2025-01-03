import "./expenseform.css";
import SlideNav from "./SlideNav.js";
import { FiUpload } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExpenseForm() {
  const navigate = useNavigate();
  const [budgetTitle, setBudgetTitle] = useState("");
  const [expenses, setExpenses] = useState([
    { expenseName: "", amount: "", date: "", attachment: null },
  ]);

  const handleAddExpense = () => {
    setExpenses([...expenses, { expenseName: "", amount: "", date: "", attachment: null }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][field] = value;
    setExpenses(updatedExpenses);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const updatedExpenses = [...expenses];
    //updatedExpenses[index].attachment = file || null; 
    updatedExpenses[index].attachment = file;
    //updatedExpenses[index].attachment = file ? file.name : "";
    setExpenses(updatedExpenses);
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("budgetTitle", budgetTitle);
    expenses.forEach((expense, index) => {
      formData.append(`expenseName_${index + 1}`, expense.expenseName);
      formData.append(`amount_${index + 1}`, expense.amount);
      formData.append(`date_${index + 1}`, expense.date);
      
      if (expense.attachment) {
        formData.append(`attachment_${index + 1}`, expense.attachment);
      }
    });

    //expenses.forEach((expense, index) => {
      //formData.append(`expenses[${index}][expenseName]`, expense.expenseName);
      //formData.append(`expenses[${index}][amount]`, expense.amount);
      //formData.append(`expenses[${index}][date]`, expense.date);
      //if (expense.attachment) {
        //formData.append(`expenses[${index}][attachment]`, expense.attachment); // Include the file
     // }
  //});

    try {
      const response = await fetch("https://finance-tracker-wknd.onrender.com/api/expenses", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Expenses saved successfully!");
        navigate("/expense");
      } else {
        const errorData = await response.json();
        alert(`Failed to save expenses: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving expenses:", error);
      alert("An error occurred while saving expenses. Please try again later.");
    }
  };

  return (
    <div className="maindiv">
      <SlideNav />
      <form>
        <h3 style={{ textAlign: "left", marginLeft: "20px", marginTop: "12px" }}>
          Create a new expense
        </h3>
        <div className="inputgroup" style={{ marginLeft: 20, marginTop: 5 }}>
          <label>Budget Title</label>
          <input
            type="text"
            placeholder="Eg Projectname"
            style={{ width: "84%" }}
            value={budgetTitle}
            onChange={(e) => setBudgetTitle(e.target.value)}
          />
        </div>
        {expenses.map((expense, index) => (
          <div key={index}>
            <div className="row1">
              <div className="inputgroup">
                <label>Expense Name</label>
                <input
                  type="text"
                  style={{ width: "90%" }}
                  placeholder="Eg Software subscription"
                  value={expense.expenseName}
                  onChange={(e) => handleInputChange(index, "expenseName", e.target.value)}
                />
              </div>
              <div className="inputgroup">
                <label>Expense Amount</label>
                <input
                  type="number"
                  style={{ width: "90%" }}
                  placeholder="Enter the amount"
                  value={expense.amount}
                  onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                />
              </div>
              <div className="crossicon">
                <AiOutlineClose
                  className="remove-icon"
                  onClick={() => handleRemoveExpense(index)}
                />
              </div>
            </div>

            <div className="row1">
              <div className="inputgroup">
                <label>Payment Date</label>
                <input
                  type="date"
                  style={{ width: "90%" }}
                  value={expense.date}
                  onChange={(e) => handleInputChange(index, "date", e.target.value)}
                />
              </div>
              <div className="inputgroup" style={{ marginRight: "75px" }}>
                <label>Add attachment</label>
                <div className="wrapper">
                  <label className="customfileupload">
                    <FiUpload className="uploadicon" />
                    Upload file
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(index, e)}
                      style={{ display: "none" }}
                    />
                  </label>
                  {expense.attachment && (
                    <span className="file-name">{expense.attachment.name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <br />
        <div>
          <button
            type="button"
            className="addbutton"
            onClick={handleAddExpense}
          >
            <AiOutlinePlus className="addbuttonicon" /> Add another expense
          </button>
        </div>
        <div>
          <button
            className="savebutton"
            onClick={handleSave}
            style={{
              color: "white",
              background: "blue",
              marginBottom: "80px",
              border: "none",
              borderRadius: "5px",
              width: "15%",
            }}
          >
            Save
          </button>

          <button
            onClick={() => navigate("/expense")}
            className="backbutton"
            style={{
              color: "blue",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginLeft: "12px",
              marginBottom: "80px",
              width: "15%",
            }}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
