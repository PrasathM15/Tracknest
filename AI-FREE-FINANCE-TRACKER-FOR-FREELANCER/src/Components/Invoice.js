import { useNavigate} from "react-router-dom";
import { useState,useEffect } from "react";
import SlideNav from "./SlideNav.js";
import { LuDownload } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

//import html2canvas from 'html2canvas';
const checkDueDateStatus = (paymentDueDate) => {
  const currentDate = new Date();
  const dueDate = new Date(paymentDueDate);
  const differenceInTime = currentDate - dueDate;
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays > 4;
};

export default function Invoice(){
    const navigate = useNavigate()
    const [invoices, setInvoices] = useState([]);
    const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [unpaidAmount, setUnpaidAmount] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0); 
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/invoice');
        const data = await response.json();

        if (data.success) {
          const fetchedInvoices = data.data;
          setInvoices(fetchedInvoices);

          // Calculate paid, unpaid count, and unpaid amount
          const paidInvoices = fetchedInvoices.filter(invoice => invoice.paymentstatus === 'Paid');
          const unpaidInvoices = fetchedInvoices.filter(invoice => invoice.paymentstatus === 'Unpaid');
          const totalUnpaidAmount = unpaidInvoices.reduce((total, invoice) => total + invoice.grandTotal, 0);
          console.log("Paid Invoices: ", paidInvoices);
          console.log("Unpaid Invoices: ", unpaidInvoices);
  
          setPaidCount(paidInvoices.length);
          setUnpaidCount(unpaidInvoices.length);
          setUnpaidAmount(totalUnpaidAmount);
          setTotalInvoices(fetchedInvoices.length);  // Set the total number of invoices
        } else {
          alert('Error fetching invoices');
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  // Function to handle filter selection
  const handleFilterChange = (status) => {
    setFilter(status);
  };

  // Filter invoices based on the selected status
  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'All') return true;
    if (filter === 'Paid' && invoice.paymentstatus === 'Paid') return true;
    if (filter === 'Unpaid' && invoice.paymentstatus === 'Unpaid') return true;
    if (filter === 'Overdue' && invoice.paymentstatus === 'Overdue') return true;
    return false;
  });

    
    const downloadInvoice =async (invoice) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const lineSpacing = 7;
      doc.setFillColor(128, 0, 128); // Violet color for the background
           const headerHeight = 15; // Set the height for the header
          doc.rect(margin, margin, pageWidth - margin * 3, headerHeight, 'F');
      // Add Invoice Header
      doc.setFontSize(24);
      doc.setFont("times", "normal"); 
      doc.setTextColor(255, 255, 255); // Violet color for heading
      doc.text("Invoice", pageWidth / 2, margin + headerHeight/ 2+3, { align: "center" });

try {
  const logoResponse = await fetch(`http://localhost:5000/api/invoice/logo/${invoice.logo}`);
  const signatureResponse = await fetch(`http://localhost:5000/api/invoice/signature/${invoice.signature}`);

  if (logoResponse.ok && signatureResponse.ok) {
    const logoBlob = await logoResponse.blob();
    const signatureBlob = await signatureResponse.blob();

    // Convert Blob to Base64
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });

    const signatureBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(signatureBlob);
    });

    // Add Logo to PDF
    const logoWidth = 40; // Width of the logo
    const logoHeight = 20; // Height of the logo
    doc.addImage(logoBase64, "PNG", margin, margin + 10, logoWidth, logoHeight);

    // Add Signature to PDF
    const signatureWidth = 50; // Width of the signature
    const signatureHeight = 25; // Height of the signature
    doc.addImage(signatureBase64, "PNG", pageWidth - margin - signatureWidth, doc.internal.pageSize.getHeight() - signatureHeight - margin, signatureWidth, signatureHeight);
  } else {
    console.error("Error fetching logo or signature.");
  }
} catch (error) {
  console.error("Error fetching images:", error);
}





 // Add Invoice Details
 
  let currentY = margin + 20;
  doc.setFontSize(14);
  doc.text("Invoice Details:", margin, currentY);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Reset to black
  currentY += lineSpacing;
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, margin, currentY);
  currentY += lineSpacing;
  doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, margin, currentY);
  currentY += lineSpacing;
  doc.text(`Payment Due Date: ${new Date(invoice.paymentDueDate).toLocaleDateString()}`, margin, currentY);

  // Add Company Details (Left)
  currentY += lineSpacing * 2;
  doc.setFontSize(14);
  doc.setTextColor(128, 0, 128); // Violet color for heading
  doc.text("Billed To", margin, currentY);

  currentY += lineSpacing;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.text(`Full Name: ${invoice.companyDetails.fullName}`, margin, currentY);
  currentY += lineSpacing;
  doc.text(`Company Name: ${invoice.companyDetails.companyName}`, margin, currentY);
  currentY += lineSpacing;
  doc.text(`Email: ${invoice.companyDetails.email}`, margin, currentY);
  currentY += lineSpacing;
  doc.text(`Phone: ${invoice.companyDetails.phone}`, margin, currentY);
  currentY += lineSpacing;
  doc.text(`Address: ${invoice.companyDetails.address}`, margin, currentY);
  currentY += lineSpacing;
  doc.text(`GST NO: ${invoice.companyDetails.gst}`, margin, currentY);

  // Add Freelancer Details (Right)
  let freelancerX = pageWidth / 2 + 10; // Position on the right side
  currentY = margin + 55;

  doc.setFontSize(14);
  doc.setTextColor(128, 0, 128); // Violet color for heading
  doc.text("From", freelancerX, currentY);

  currentY += lineSpacing * 2;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.text(`Full Name: ${invoice.freelancerDetails.fullName}`, freelancerX, currentY);
  currentY += lineSpacing;
  doc.text(`Business Name: ${invoice.freelancerDetails.businessName}`, freelancerX, currentY);
  currentY += lineSpacing;
  doc.text(`Email: ${invoice.freelancerDetails.email}`, freelancerX, currentY);
  currentY += lineSpacing;
  doc.text(`Phone: ${invoice.freelancerDetails.phone}`, freelancerX, currentY);
  currentY += lineSpacing;
  doc.text(`Address: ${invoice.freelancerDetails.address}`, freelancerX, currentY);
  currentY += lineSpacing;
  doc.text(`GST NO: ${invoice.freelancerDetails.gst}`, freelancerX, currentY);
  currentY += lineSpacing * 2;

  // Table with custom headings
  const tableStartY = currentY + lineSpacing ;
  autoTable(doc, {
      startY: tableStartY,
      head: [["Sno", "Description", "Qty/Hrs", "Price", "Total Amount"]],
      body: invoice.tableRows.map((item, index) => [
          index + 1,
          item.description || "N/A",
          item.qty || "N/A",
          item.price || "N/A",
          item.amount || 0,
      ]),
      headStyles: {
          fillColor: [128, 0, 128], // Violet background for headings
          textColor: [255, 255, 255], // White text color for headings
      },
      styles: {
          halign: "center",
      },
  });

  // Add Grand Total (positioned to the right)
  const tableEndY = doc.lastAutoTable.finalY;
  doc.setFontSize(12);
  doc.text(`Grand Total: ${invoice.grandTotal || 0}`, pageWidth - margin - 50, tableEndY + lineSpacing * 2);

  // Add Terms and Conditions inside a box
  const termsStartY = tableEndY + lineSpacing * 4;
  doc.setFontSize(14);
  doc.setTextColor(128, 0, 128); 
  doc.text("Terms and Conditions:", margin, termsStartY);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.setFontSize(12);
  doc.setTextColor(0,0,0); 
  doc.rect(margin, termsStartY + 5, pageWidth - margin * 2, 18);
  doc.text(invoice.termsAndConditions || "No terms provided.", margin + 5, termsStartY + 15);

  // Add Bank Details
  doc.setFontSize(14);
  const bankStartY = termsStartY + 40;
  doc.setTextColor(128, 0, 128);
  doc.text("Bank Details:", margin, bankStartY);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Bank Name: ${invoice.bankDetails.bankName || "N/A"}`, margin, bankStartY + lineSpacing);
  doc.text(`IFSC Code: ${invoice.bankDetails.ifscCode || "N/A"}`, margin, bankStartY + lineSpacing * 2);
  doc.text(`Account Number: ${invoice.bankDetails.accountNumber || "N/A"}`, margin, bankStartY + lineSpacing * 3);
  doc.text(`Branch: ${invoice.bankDetails.branch || "N/A"}`, margin, bankStartY + lineSpacing * 4);
   
  
      // Add Footer
      doc.setFontSize(10);
      doc.text("Thank you for your business!", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
        align: "center",
      });
    
     // Save PDF
      doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    
    }; 

    const handlePaymentStatusChange = async (id, newStatus) => {
      try {
        const response = await fetch(`http://localhost:5000/api/invoice/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentstatus: newStatus }),
        });
  
        if (response.ok) {
          const updatedInvoice = await response.json();
          setInvoices((prevInvoices) =>
            prevInvoices.map((invoice) =>
              invoice._id === id ? { ...invoice, paymentstatus: newStatus } : invoice
            )
          );
        // Recalculate the counts
        const paidInvoices = updatedInvoice.data.filter(invoice => invoice.paymentstatus === 'Paid');
        const unpaidInvoices = updatedInvoice.data.filter(invoice => invoice.paymentstatus === 'Unpaid');
        const totalUnpaidAmount = unpaidInvoices.reduce((total, invoice) => total + invoice.grandTotal, 0);

        setPaidCount(paidInvoices.length);
        setUnpaidCount(unpaidInvoices.length);
        setUnpaidAmount(totalUnpaidAmount);
      } else {
        alert('Error updating payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };
    return(
      <>
      
        <div className="invoice_div" style={{marginTop: '-70px'}} >
            <SlideNav/>
            
            <div>
            <h2 style={{ marginLeft: '280px' ,marginTop:'90px'}}>My Invoice</h2>

            </div>
            <div className="twobuttons" style={{display:'flex',gap:'15px' }} >
            
            <button style={{color:'white',background:'#7840B0',marginLeft:'1200px',textAlign:'center',alignItems:'center'}}
            classname='addinvoice' onClick={()=>navigate('/newinvoice')}> + Create new invoice</button>
            </div>

                <div className="trackinvoice" style={{display:"flex",padding:'3px'}}>
                    <h3 className="invoice_count"
                    style={{border:'1px solid #ccc',width:'180px',marginLeft:'350px',marginTop:'20px',
                        background:'white',borderRadius:'12px',height:'80px',padding:'10px', 
                        boxShadow: '0 4px 8px rgba(128, 128, 128, 0.4), 0 0 15px rgba(128, 128, 128, 0.6)',
                        
                    }}>Total invoices <p>{totalInvoices}</p></h3>
                     <h3 className="invoice_count"
                    style={{border:'1px solid #ccc',width:'180px',marginLeft:'100px',marginTop:'20px',
                        background:'white',borderRadius:'12px',height:'80px',padding:'10px',
                        boxShadow: '0 4px 8px rgba(128, 128, 128, 0.4), 0 0 15px rgba(128, 128, 128, 0.6)',
                    }}> Paid Invoices <p>{paidCount}</p></h3>
                    <h3 className="invoice_count"
                    style={{border:'1px solid #ccc',width:'180px',marginLeft:'100px',marginTop:'20px',
                        background:'white',borderRadius:'12px',height:'80px',padding:'10px',
                        boxShadow: '0 4px 8px rgba(128, 128, 128, 0.4), 0 0 15px rgba(128, 128, 128, 0.6)',
                    }}> UnPaid Invoices <p>{unpaidCount}</p></h3>
                    <h3 className="unpaid_amount"
                    style={{width:'190px',marginLeft:'100px',marginTop:'20px',
                        background:'#3E3FD8',borderRadius:'12px',height:'80px',padding:'10px',color:'white',fontWeight:'bold'
                       
                    }}> Unpaid Amount <p>{unpaidAmount}</p></h3>
     
             </div>


             
              {/* Filter options */}
        <div style={{ display: 'flex', fontSize:'16px',justifyContent: 'center' ,gap: '0px', padding: '10px',marginRight:'500px'}}>
          
          <div 
            onClick={() => handleFilterChange('All')}
            style={{ padding: '10px', cursor: 'pointer', borderBottom: filter === 'All' ? '3px solid blue' : '3px solid lightblue' }}
          >
            All
          </div>
          <div
            onClick={() => handleFilterChange('Paid')}
            style={{ padding: '10px', cursor: 'pointer', borderBottom: filter === 'Paid' ? '3px solid blue' : '3px solid lightblue' }}
          >
            Paid
          </div>
          <div
            onClick={() => handleFilterChange('Unpaid')}
            style={{ padding: '10px', cursor: 'pointer', borderBottom: filter === 'Unpaid' ? '3px solid blue' : '3px solid lightblue' }}
          >
            Unpaid
          </div>
          <div
            onClick={() => handleFilterChange('Overdue')}
            style={{ padding: '10px', cursor: 'pointer', borderBottom: filter === 'Overdue' ? '3px solid blue' : '3px solid lightblue' }}
          >
            Overdue
          </div>
        </div>
        
             
              {/* Conditional Rendering */}
    {invoices.length === 0 ? (


<div
style={{
  textAlign: 'center',
  marginTop: '60px',
  width: '50%',
  marginLeft:'650px',
  borderRadius: '6px',
  backgroundColor: 'green',
  color: 'white',
  padding: '15px',
  display: 'inline-block',
}}
>
<h3 style={{ margin: 0 }}>No invoices found. Submit a form to create an invoice.</h3>
</div>
    ) : (
      
      
            
  
    <table className="invoice-table" style={{ width: "auto", margin: "20px auto", borderCollapse: "collapse",
     borderRadius:'12px',overflow:'hidden', border:'1px solid blue', marginTop:'30px'}}>
      <thead>
        <tr>
          <th>Invoice No</th>
          <th>Company Name</th>
          <th>Amount</th>
          <th>Payment Due Date</th>
          <th>Payment Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredInvoices.map((invoice) => (
          <tr key={invoice._id}>
            
            <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>{invoice.invoiceNumber}</td>
            <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>{invoice.companyDetails.companyName}</td>
            <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>{invoice.grandTotal}</td>
            <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>{new Date(invoice.paymentDueDate).toLocaleDateString()}</td>
            <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>
              <select value={invoice.paymentstatus}
                onChange={(e) => handlePaymentStatusChange(invoice._id, e.target.value)}
               className="payment-status" style={{  
                
                borderRadius: "5px", 
                fontSize: "14px", 
                padding: "5px",
                backgroundColor: invoice.paymentstatus === 'Paid' ? 'lightgreen' : 
                invoice.paymentstatus === 'Overdue' ? 'red' : 
                'yellow', 
              }} >
                <option style={{ color: 'black' }}>Unpaid</option>
                <option style={{ color: 'black' }}>Paid</option>
                <option style={{ color: 'black' }}>Overdue</option>
              </select>
            </td>
            
            <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>
            <button  onClick={() => downloadInvoice(invoice)} style={{ background: "none", border: "none", cursor: "pointer"}}><LuDownload  style={{color:'green',fontSize:'18px'}}/></button>
              <button style={{ background: "none", border: "none", cursor: "pointer"}}><MdDelete style={{color:'red',fontSize:'18px'}} /></button>
             
            </td>
          </tr>
       
        ))}
         
      </tbody>
     
    </table>
    )}
    
    
            
    </div>
    </>
   
            
       
    );
}