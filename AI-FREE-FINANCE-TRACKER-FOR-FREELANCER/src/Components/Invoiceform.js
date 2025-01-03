import './invoiceform.css';
import SlideNav from "./SlideNav.js";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
//import Invoice from './/Invoice';


export default function Invoiceform( ){
    const navigate = useNavigate()
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);
    const[termsAndConditions,settermsAndConditions]=useState('');
    const [paymentDueDate, setPaymentDueDate] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [grandTotal, setGrandTotal] = useState(0); // Store Grand Total
    const [paymentstatus, setpaymentstatus] = useState('Unpaid'); 
    const [freelancerDetails, setFreelancerDetails] = useState({
        fullName: '',
        businessName: '',
        email: '',
        phone: '',
        address: '',
        gst: '',
    });
    const [companyDetails, setCompanyDetails] = useState({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        address: '',
        gst: '',
    });
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        ifscCode: '',
        accountNumber: '',
        branch: '',
    });
    

  //Task 2: State for table rows
  const [tableRows, setTableRows] = useState([
    { sno: '', description: '', qty: '', price: '', amount: 0 },
  ]); 

 
  // set state for objects
  const handleFreelancerChange = (e) => {
    const { name, value } = e.target;
    setFreelancerDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



     // Load data from localStorage on mount
     useEffect(() => {
      const savedData = JSON.parse(localStorage.getItem('invoiceFormData'));
      if (savedData) {
          setInvoiceNumber(savedData.invoiceNumber || '');
          setPaymentDueDate(savedData.paymentDueDate || '');
          setInvoiceDate(savedData.invoiceDate || '');
          setFreelancerDetails(savedData.freelancerDetails || {
              fullName: '',
              businessName: '',
              email: '',
              phone: '',
              address: '',
              gst: '',
          });
          setCompanyDetails(savedData.companyDetails || {
              fullName: '',
              companyName: '',
              email: '',
              phone: '',
              address: '',
              gst: '',
          });
          setBankDetails(savedData.bankDetails || {
              bankName: '',
              ifscCode: '',
              accountNumber: '',
              branch: '',
          });
          setTableRows(savedData.tableRows || [
              { sno: '', description: '', qty: '', price: '', amount: 0 },
          ]);
      }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
      const dataToSave = {
          invoiceNumber,
          paymentDueDate,
          invoiceDate,
          freelancerDetails,
          companyDetails,
          bankDetails,
          tableRows,
      };
      localStorage.setItem('invoiceFormData', JSON.stringify(dataToSave));
  }, [invoiceNumber, paymentDueDate, invoiceDate, freelancerDetails, companyDetails, bankDetails, tableRows]);
  
  // Task 2: Function to add a new row
  const addRow = () => {
    setTableRows([
      ...tableRows,
      { sno: '', description: '', qty: '', price: '', amount: 0 },
    ]);
  };
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = value;

    // Calculate the amount when qty or price changes
    if (field === 'qty' || field === 'price') {
      const qty = parseInt(updatedRows[index].qty) || 0;
      const price = parseInt(updatedRows[index].price) || 0;
      updatedRows[index].amount = qty * price;
    }
      // Update Grand Total
  const total = updatedRows.reduce((sum, row) => sum + row.amount, 0);
  setGrandTotal(total);
    setTableRows(updatedRows);
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();
   const formData = new FormData();
   
    formData.append('logo', logo);
    formData.append('signature', signature);
    formData.append('invoiceNumber', invoiceNumber);
    formData.append('invoiceDate', invoiceDate);
    formData.append('paymentDueDate', paymentDueDate);
    formData.append('freelancerDetails', JSON.stringify(freelancerDetails));
    formData.append('companyDetails', JSON.stringify(companyDetails));
    formData.append('bankDetails', JSON.stringify(bankDetails));
    formData.append('tableRows', JSON.stringify(tableRows));
    formData.append('grandTotal', grandTotal); 
    formData.append('termsAndConditions',termsAndConditions);
    formData.append('paymentstatus', paymentstatus);
  
    try {
      const response = await fetch('https://finance-tracker-wknd.onrender.com/api/invoice', {
        method: 'POST',
        body: formData,
      });   
  
      if (response.ok) {
        alert('Invoice created successfully!');
        navigate('/invoice');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  // Task 1: Handle file input change
  //const handleFileChange = (e) => {
    //if (e.target.files.length > 0) {
     // setUploadedFileName(e.target.files[0].name);
    //}
 // }; 
 
    
    return(
        <div>
         <SlideNav/>


      <main className="content">
        <header className="content-header">
          <h2 style={{color:'#000',marginTop:'100px',marginRight:'470px'}} >Create a New Invoice </h2>
        </header>

        <section  className="invoice-form">
        <form >
          <div className="row" >
            <div className="col" >
              <label>Invoice Number</label>
              <input type="text" placeholder="Enter invoice number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)}  />
            </div>
            <div className="col">
              <label>Add Logo</label>
              <label className="file-label" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="file-icon"><FiUpload className="uploadicon" /></span>
                  <span className="file-text" style={{ marginRight: '10px' }}>Upload File</span>
                  <input
                    type="file"
                    className="file-input" onChange={(e) => setLogo(e.target.files[0])} accept="image/*" 
                    
                    style={{ display: 'none' }}
                   
                  />
                  
                 
                  {logo && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#333' }}>{logo.name}</span>}
                      
                </label>
                
               
              </div>
              </div>
          

          <div className="row">
            <div className="col">
              <label>Payment Due Date</label>
              <input type="date" value={paymentDueDate} onChange={(e) => setPaymentDueDate(e.target.value)}  />
            </div>
            <div className="col">
              <label>Invoice Date</label>
              <input type="date"  VALUE={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}/>
            </div>
            
          </div>
          
          <h3 style={{marginRight:'180px', marginBlockStart:'10px' }}>Freelancer Details</h3>
          <div className="row" style={{marginTop:'15px'}}>
            <div className="col">
              <label >Full Name</label>
              <input type="text" placeholder="Enter your name" name="fullName" value={freelancerDetails.fullName}
            onChange={handleFreelancerChange} />
            </div>
            <div className="col">
              <label>Business Name</label>
              <input type="text" placeholder="Enter business name" name="businessName" value={freelancerDetails.businessName}
            onChange={handleFreelancerChange}/>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Email ID</label>
              <input type="email" placeholder="Enter email"  name="email" value={freelancerDetails.email}
            onChange={handleFreelancerChange}/>
            </div>
            <div className="col">
              <label>Phone Number</label>
              <input type="number" placeholder="Enter phone number" name="phone" value={freelancerDetails.phone}
            onChange={handleFreelancerChange} />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Address</label>
              <textarea  name="address"
            value={freelancerDetails.address}
            onChange={handleFreelancerChange} style={{marginLeft:'1px'}}rows="3"></textarea>
            </div>
            <div className="col">
              <label>GST Number</label>
              <input type="text" placeholder="Enter GST number"  name="gst"
            value={freelancerDetails.gst}
            onChange={handleFreelancerChange} />
            </div>
          </div>
          <h3 style={{marginRight:'150px',marginBlockStart:'10px'}}>Company Details</h3>
          <div className="row">
            <div className="col">
              <label >Full Name</label>
              <input type="text" placeholder="Enter your name"  name="fullName" value={companyDetails.fullName}
            onChange={handleCompanyChange}/>
            </div>
            <div className="col">
              <label>Company Name</label>
              <input type="text" placeholder="Enter Company name"  name="companyName"
            value={companyDetails.companyName}
            onChange={handleCompanyChange} />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Email ID</label>
              <input type="email" placeholder="Enter email"  name="email"
            value={companyDetails.email}
            onChange={handleCompanyChange} />
            </div>
            <div className="col">
              <label>Phone Number</label>
              <input type="number" placeholder="Enter phone number"  name="phone"
            value={companyDetails.phone}
            onChange={handleCompanyChange} />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Address</label>
              <textarea  name="address"
            value={companyDetails.address}
            onChange={handleCompanyChange} rows="3"></textarea>
            </div>
            <div className="col">
              <label>GST Number</label>
              <input type="text" placeholder="Enter GST number" name="gst"
            value={companyDetails.gst}
            onChange={handleCompanyChange} />
            </div>
          </div>
          <table className="invoice-table">
            <thead>
              <tr>
                <th className="sno" >SNO</th>
                <th >Description</th>
                <th >Qty/Hrs</th>
                <th >Price</th>
                <th >Total Amount</th>

              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={index}>
                  <td><input type="number" className="sno"  value={row.sno}
                onChange={(e) => handleInputChange(index, 'sno', e.target.value)} /></td>
                  <td><input type="text" className="desc" value={row.description}
                onChange={(e) => handleInputChange(index, 'description', e.target.value)}/></td>
                  <td><input type="number" className="qty" value={row.qty}
                onChange={(e) => handleInputChange(index, 'qty', e.target.value)} /></td>
                  <td><input type="number" className="price"  value={row.price}
                onChange={(e) => handleInputChange(index, 'price', e.target.value)} /></td>
                  <td><p className="amt">{row.amount}</p></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={addRow} className='newrow' style={{marginRight:'820px',color:'white',background:'green',fontWeight:'normal'}}>Add row</button>
          </div>
          <div className="totals-section">
       
        <div className="grand-total" style={{marginRight:'80px',marginBottom:'2px'}}>Grand Total: {grandTotal} </div>
      </div>

      <div className='terms' >
        <h3 className='termsandcond'style={{marginRight:'650px',marginBlockStart:'10px'}}>TERMS AND CONDITIONS</h3>
        <input type="text" className='termwidth'  value={termsAndConditions} onChange={(e) => settermsAndConditions(e.target.value)}style={{width:'80%',marginRight:'600px'}}/>
        </div>

      <h3 style={{ marginBlockStart:'10px',marginBlock:'20px',marginLeft:'150px'}}className="bankdetails_heading">BANK DETAILS</h3>
      <div className="details-section">
        <div className="input-group">
          <label>Bank Name</label>
          <input type="text"  name="bankName"
            value={bankDetails.bankName}
            onChange={handleBankChange} className='bankname' style={{width:'50%',marginRight:'600px'}} />
        </div>
        <div className="input-group">
          <label>IFSC CODE</label>
          <input type="text" className='ifsc' name="ifscCode"
            value={bankDetails.ifscCode}
            onChange={handleBankChange}style={{width:'50%',marginRight:'600px'}} />
        </div>
        <div className="input-group">
          <label>Account number</label>
          <input type="number" name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={handleBankChange} className='accno' style={{width:'50%',marginRight:'600px'}} />
        </div>
        <div className="input-group">
          <label>Branch</label>
          <input type="text"  name="branch"
            value={bankDetails.branch}
            onChange={handleBankChange} className='branch' style={{width:'50%',marginRight:'600px'}} />
        </div>
      </div>

      <div className="upload-logo">
        <label>Signature</label>
        <label className="file-label">
                  <span className="file-icon"><FiUpload className="uploadicon" /></span>
                  <span className="file-text">Upload File</span>
                  <input
                    type="file"
                    className="file-input" onChange={(e) => setSignature(e.target.files[0])} accept="image/png, image/jpeg"

                   
                    style={{ display: 'none' }}

                  />
                  {signature && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#333' }}>{signature.name}</span>}
                
                    
                  
                </label>
       
      </div>
<br/>
      <div className="buttons">
      <button  className="submitbutton" onClick={handleSubmit}>Submit</button>
       
        <div>  <button onClick={()=>navigate('/invoice')}  style={{marginLeft:'10px'}} className="close" >Close</button></div>
       <br/>
       <br/>
       <br/>
      </div>
      </form>
        </section>
      </main>
      
    </div>
  );
}