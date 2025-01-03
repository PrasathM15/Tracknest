import React, { useState} from "react";
import {BrowserRouter as Router, Routes, Route ,Link,Navigate} from 'react-router-dom';

import Incomeform from "./Components/Incomeform.js";

import Budget from './Components/Budget';
import Budgetform  from './Components/Budgetform.js';
import Incomepage from './Components/Incomepage.js';
// import SlideNav from "./Components/SlideNav.js";
import Dashboard from "./Components/Dashboard.js";
import SignUp from "./Components/SignUp.js";
import Login from "./Components/Login.js";
import Invoice from "./Components/Invoice.js";
import Expenseform from "./Components/Expenseform.js"
import Expense from "./Components/Expense.js"
import Tax from "./Components/Tax.js";
import LandingPage from "./Components/LandingPage.js";
import SettingsPage from "./Components/SettingsPage";
import ProfilePage from "./Components/ProfilePage.js";
import Password from "./Components/Password.js";
import Notification from "./Components/Notification"; 
import "./App.css"; // Optional global styles
import Overview from "./Components/Overview.js";
import Invoiceform from "./Components/Invoiceform.js";

function App() {
 
  return (
    <Router>
    <div className="App" style={{ paddingTop: "60px" }}>
       {/* {window.location.pathname !== "/Login" && window.location.pathname !== "/signup" && window.location.pathname !=="/landing" && <SlideNav />} */}

      <Routes>
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/incomecreate" element={<Incomeform /> } />
      <Route path="/income" element={<Incomepage />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/create-budget" element={<Budgetform />} />
      {/* <Route path="/slidenav" element={<SlideNav />} /> */}
      {/* <Route path="/" element={<Incomepage />} /> */}
      {/* <Route path="/" element={<Budget /> } /> */}
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/expense" element={<Expense />} />
      <Route path="/expenseform" element={<Expenseform />} />
      <Route path="/profile" element={<ProfilePage/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/password" element={<Password/>}/>
      <Route path="/tax" element={<Tax/>}/>
      <Route path="notification" element={<Notification/>}/>
      <Route path="/overview" element={<Overview/>}/>
      <Route path="/landing" element={<LandingPage/>}/>
      <Route path="/newinvoice" element={<Invoiceform/>}/>
      {/* <Route path="/" element={<LandingPage/>}/> */}
      <Route path="*" element={<h1>Page Not Found</h1>}/>
      </Routes>
    </div>
    
    </Router>
  );
}

export default App;


