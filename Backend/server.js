const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { stringify } = require('querystring');
// const router = express.Router()
// const Income = require('../src/Incomepage');

const app = express();
const PORT = 5000; // Backend server port

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));



// MongoDB connection
const mongoURI = 'mongodb+srv://sandhya488495:mongosandhya@cluster0.ajpou.mongodb.net/tracknest?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

    //expens schema

    const expenseSchema = new mongoose.Schema({
      budgetTitle: { type: String, required: true },
      expenses: [
          {
              expenseName: { type: String, required: true },
              amount: { type: Number, required: true },
              date: { type: Date, required: true },
              attachment: { type: String },
          },
      ],
  });
  
  const Expense = mongoose.model('Expense', expenseSchema);
  
  // File upload setup
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads'); // Folder where files will be saved
      },
      filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
      },
  });
  
  const upload = multer({ storage });
  
  // Define fields for file upload (e.g., 'attachment' field)
  const uploadFields = upload.fields([{ name: 'attachment' }]);
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // POST route to save expenses
  app.post("/api/expenses", upload.fields([{ name: 'attachment_1' }, { name: 'attachment_2' }, { name: 'attachment_3' }]), async (req, res) => {
    try {
      const { budgetTitle } = req.body;
      const expenses = [];
  
      // Loop through each expense field and store attachments if available
      for (let i = 0; i < Object.keys(req.body).length; i++) {
        const expenseName = req.body[`expenseName_${i + 1}`];
        if (expenseName) {
          let attachmentPath = null;
          if (req.files && req.files[`attachment_${i + 1}`]) {
            attachmentPath = req.files[`attachment_${i + 1}`][0].path.replace('uploads\\', '').replace('uploads/', '');
            //attachmentPath = req.files[`attachment_${i + 1}`][0].path.replace('uploads\\', ''); // Removing 'uploads/' part
          }
          expenses.push({
            expenseName: expenseName,
            amount: req.body[`amount_${i + 1}`],
            date: req.body[`date_${i + 1}`],
            attachment: attachmentPath,
          });
        }
      }
  
      // Save the expense data into the database
      const newExpense = new Expense({
        budgetTitle,
        expenses,
      });
      await newExpense.save();
  
      // Send response back to the client
      res.status(200).json({
        message: "Expenses saved successfully",
        budgetTitle,
        expenses,
      });
    } catch (error) {
      console.error("Error saving expenses:", error);
      res.status(500).json({ message: "An error occurred while saving expenses." });
    }
  });

  // API to fetch all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find(); // Fetch all expenses from the database
        const totalAmount = expenses.reduce((total, expense) => {
            return total + expense.expenses.reduce((sum, expenseDetail) => {
                return sum + expenseDetail.amount;
            }, 0);
        }, 0);
        res.status(200).json({ expenses, totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/expenses/filter', async (req, res) => {
  try {
    const { fromDate, toDate, budgetTitle, amount } = req.query;

    // Build dynamic query object
    let query = {};

    if (fromDate || toDate) {
      query['expenses.date'] = {};
      if (fromDate) query['expenses.date'].$gte = new Date(fromDate);
      if (toDate) query['expenses.date'].$lte = new Date(toDate);
    }

    if (budgetTitle) {
      query['budgetTitle'] = new RegExp(budgetTitle, 'i'); // Case-insensitive match
    }

    if (amount) {
      const [operator, value] = amount.match(/[<>=]+|[\d.]+/g);
      const numericValue = parseFloat(value);
      if (operator === '>') query['expenses.amount'] = { $gt: numericValue };
      else if (operator === '<') query['expenses.amount'] = { $lt: numericValue };
      else if (operator === '=' || operator === '==')
        query['expenses.amount'] = { $eq: numericValue };
    }

    // Use aggregation to filter nested fields (expenses array)
    const filteredExpenses = await Expense.aggregate([
      { $unwind: '$expenses' }, // Flatten the expenses array
      { $match: query }, // Apply dynamic filters
      {
        $group: {
          _id: '$_id',
          budgetTitle: { $first: '$budgetTitle' },
          expenses: {
            $push: {
              expenseName: '$expenses.expenseName',
              amount: '$expenses.amount',
              date: '$expenses.date',
              attachment: '$expenses.attachment',
            },
          },
        },
      },
    ]);

    // Calculate the filtered total amount
    const filteredTotalAmount = filteredExpenses.reduce((total, expense) => {
      return total + expense.expenses.reduce((sum, expenseDetail) => {
        return sum + expenseDetail.amount;
      }, 0);
    }, 0);

    // Send both filtered expenses and the filtered total amount
    res.status(200).json({
      expenses: filteredExpenses,
      filteredTotalAmount: filteredTotalAmount
    });
  } catch (error) {
    console.error('Error applying filters:', error);
    res.status(500).json({ error: error.message });
  }
});



// Budget Schema
// GET /api/budgets route
app.get('/api/budgets', async (req, res) => {
  // const email = req.query;
  try {
    const budgets = await Budget.find(); // Fetch all budgets from MongoDB
    res.json({ budgets }); // Return the budgets in JSON format
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

const budgetSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  spent: { type: Number, default: 0 }
  // email:{type :String , required:true}
});
const Budget = mongoose.model('Budget', budgetSchema);
app.post('/api/budgets', async (req, res) => {
  try {
    const { name, amount, spent } = req.body;

    // Validate input
    if (!name || !amount || !spent) {
      return res.status(400).json({ error: 'Name and amount and spent are required' });
    }

    // Create a new budget document with spent
    const newBudget = new Budget({
      name,
      amount,
      spent: spent || 0, // Default to 0 if not provided
    });

    // Save the budget to the database
    await newBudget.save();

    // Send success response
    res.status(201).json({ message: 'Budget created successfully', budget: newBudget });
  } catch (error) {
    res.status(500).json({ error: 'Error creating budget' });
  }
});


// // Fetch budgets from the database
// app.get('/api/budgets', async (req, res) => {
//   try {
//     const budgets = await Budget.find();
//     res.json({ budgets });
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching budgets' });
//   }
// });
// // Add a new budget to the database
// app.post('/api/budgets', async (req, res) => {
//   try {
//     const { name, amount } = req.body;

//     // Validate input
//     if (!name || !amount) {
//       return res.status(400).json({ error: 'Name and amount are required' });
//     }

//     // Create a new budget document
//     const newBudget = new Budget({ name, amount });

//     // Save the budget to the database
//     await newBudget.save();

//     // Send success response
//     res.status(201).json({ message: 'Budget created successfully', budget: newBudget });
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating budget' });
//   }
// });





// Income Schema
const incomeSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    date: { type: Date, required: true }
});

const Income = mongoose.model('Income', incomeSchema);

// Routes
app.post('/api/incomes', async (req, res) => {
    try {
        const newIncome = new Income(req.body);
        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// app.get('/api/incomes', async (req, res) => {
//     try {
//         const newIncome = new Income(req.body);
//         await newIncome.save();
//         res.status(201).json(newIncome);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

app.get('/api/incomes', async (req, res) => {
    try {
        const incomes = await Income.find().sort({ date: -1 }); // Sort by recent date
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch income transaction' });
    }
});
app.get('/api/income', async (req, res) => {
    try {
      const transactions = await Income.find(); // Fetch all income transactions
      const totalIncome = transactions.reduce((acc, transaction) => acc + transaction.amount, 0); // Sum up all amounts
      res.json({ transactions, totalIncome });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching incomes', error });
    }
  });

  // Auth Schema for user authentication
const authSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  repeatpassword: { type: String, required: true }
}, { 
  collection: 'details' 
});

const AuthUser = mongoose.model('AuthUser', authSchema);

// Routes
app.post('/signup', async (req, res) => {
  try {
      const { email, password, repeatpassword } = req.body;

      // Check if passwords match
      if (password !== repeatpassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Create a new user
      const newUser = new AuthUser({ email, password, repeatpassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
      // Handle duplicate email error
      if (error.code === 11000) {
          res.status(400).json({ message: 'Email already exists' });
      } else {
          res.status(400).json({ error: error.message });
      }
  }
});

app.get('/api/users', async (req, res) => {
  try {
      const users = await AuthUser.find().sort({ email: 1 }); // Sort by email
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get("/login", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await AuthUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // User Schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   repeatpassword: { type: String, required: true }
// },{ 
//   collection: 'details'
   
// });

// const User = mongoose.model('User', userSchema);

// // Routes
// app.post('/signup', async (req, res) => {
//   try {
//       const { email, password, repeatpassword } = req.body;

//       // Check if passwords match
//       if (password !== repeatpassword) {
//           return res.status(400).json({ message: 'Passwords do not match' });
//       }

//       // Create a new user
//       const newUser = new User({ email, password, repeatpassword });
//       await newUser.save();
//       res.status(201).json({ message: 'User registered successfully', user: newUser });
//   } catch (error) {
//       // Handle duplicate email error
//       if (error.code === 11000) {
//           res.status(400).json({ message: 'Email already exists' });
//       } else {
//           res.status(400).json({ error: error.message });
//       }
//   }
// });

// app.get('/api/users', async (req, res) => {
//   try {
//       const users = await User.find().sort({ email: 1 }); // Sort by email
//       res.json(users);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });


// app.get("/login", async (req, res) => {
//   const { email } = req.query;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "Email not found" });
//     }

//     res.status(200).json({ user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  paymentDueDate: {type:Date,required: true },
  invoiceDate: {type:Date,required: true },
  freelancerDetails: {type:Object,required:true},
  companyDetails: {type:Object,required:true},
  bankDetails: {type:Object,required:true},
  tableRows: {type:Array,required:true},
  logo: { type: String, required: true },
  signature: { type: String, required: true },
  grandTotal: { type: Number, required: true },
  termsAndConditions: {type:String},
  paymentstatus: { type: String, enum: ['Paid', 'Unpaid', 'Overdue'], default: 'Unpaid' }, 

});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// API Endpoints
app.post("/api/invoice", upload.fields([{ name: "logo" }, { name: "signature" }]), async (req, res) => {
  try {
    // Normalize paths to use forward slashes
    const logoPath = req.files.logo ? req.files.logo[0].path.replace(/\\/g, '/') : null;
    const signaturePath = req.files.signature ? req.files.signature[0].path.replace(/\\/g, '/') : null;
    const newInvoice = new Invoice({
      ...req.body,
      freelancerDetails: JSON.parse(req.body.freelancerDetails),
      companyDetails: JSON.parse(req.body.companyDetails),
      bankDetails: JSON.parse(req.body.bankDetails),
      tableRows: JSON.parse(req.body.tableRows),
      logo: logoPath,
      signature: signaturePath,
      grandTotal: parseInt(req.body.grandTotal) ||0 , // Parse and store Grand Total
      termsAndConditions: req.body.termsAndConditions,
      paymentstatus:req.body.paymentstatus || 'Unpaid',
    });

    await newInvoice.save();
    res.status(200).json({ success: true, message: "Invoice saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving invoice", error });
  }
});  

app.get("/api/invoice", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching invoices", error });
  }
});

app.put('/api/invoice/:id', async (req, res) => {
  const { id } = req.params;
  const { paymentstatus } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { paymentstatus },
      { new: true }
    );

    if (updatedInvoice) {
      res.status(200).json({ success: true, data: updatedInvoice });
    } else {
      res.status(404).json({ success: false, message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating payment status', error });
  }
});


// User Schema for profile
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true },
  bio: String,
  country: String,
  city: String,
});

// User Model
const User = mongoose.model('User', userSchema);

// POST API to create or update user profile
app.post('/api/profile', async (req, res) => {
  try {
    const { email, firstName, lastName, phoneNumber, dateOfBirth, bio, country, city } = req.body;

    // Log the request body to confirm all data is being received
    console.log('Request body:', req.body);

    // Check for missing required fields
    if (!email || !firstName || !lastName || !phoneNumber || !dateOfBirth) {
      return res.status(400).send('Missing required fields');
    }

    // Prepare profileData for insert/update
    const profileData = { firstName, lastName, phoneNumber, dateOfBirth, bio, country, city };

    // Use findOneAndUpdate with upsert option to create or update the user profile
    const user = await User.findOneAndUpdate({ email }, profileData, {
      new: true,
      upsert: true, // Create new document if no match is found
    });

    res.status(201).json(user); // Return the user data in the response
  } catch (err) {
    console.error('Error while updating profile:', err); // Log the error for debugging
    if (err.code === 11000) {
      res.status(400).send('Email already exists');
    } else {
      res.status(500).send('Failed to update profile. Please try again.'); // Send a more descriptive error
    }
  }
});

// GET API to fetch user profile
app.get('/api/profile', async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameters

    if (!email) {
      return res.status(400).send('Email is required');
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User profile not found');
    }

    console.log('Found user:', user); // Log the user data for debugging

    // Return all relevant user fields
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      bio: user.bio,
      country: user.country,
      city: user.city
    });
  } catch (err) {
    console.error('Error while fetching profile:', err); // Log the error for debugging
    res.status(500).send('Failed to retrieve profile. Please try again.');
  }
});

// // Define Profile Schema
// const profileSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   phoneNumber: { type: Number, required: true },
//   dateOfBirth: { type: Date, required: true },
//   bio: String,
//   country: String,
//   city: String,
// });

// // Profile Model
// const Profile = mongoose.model('Profile', profileSchema);

// // POST API to create or update profile
// app.post('/api/profile', async (req, res) => {
//   try {
//     const { email, firstName, lastName, phoneNumber, dateOfBirth, bio, country, city } = req.body;

//     // Log the request body to confirm all data is being received
//     console.log('Request body:', req.body);

//     // Check for missing required fields
//     if (!email || !firstName || !lastName || !phoneNumber || !dateOfBirth) {
//       return res.status(400).send('Missing required fields');
//     }

//     // Prepare profileData for insert/update
//     const profileData = { firstName, lastName, phoneNumber, dateOfBirth, bio, country, city };

//     // Use findOneAndUpdate with upsert option to create or update the profile
//     const profile = await Profile.findOneAndUpdate({ email }, profileData, {
//       new: true,
//       upsert: true, // Create new document if no match is found
//     });

//     res.status(201).json(profile); // Return the profile data in the response
//   } catch (err) {
//     console.error('Error while updating profile:', err); // Log the error for debugging
//     if (err.code === 11000) {
//       res.status(400).send('Email already exists');
//     } else {
//       res.status(500).send('Failed to update profile. Please try again.'); // Send a more descriptive error
//     }
//   }
// });

// // GET API to fetch profile
// app.get('/api/profile', async (req, res) => {
//   try {
//     const { email } = req.query; // Get email from query parameters

//     if (!email) {
//       return res.status(400).send('Email is required');
//     }

//     // Find the profile by email
//     const profile = await Profile.findOne({ email });

//     if (!profile) {
//       return res.status(404).send('Profile not found');
//     }

//     console.log('Found profile:', profile); // Log the profile data for debugging

//     // Return all relevant profile fields
//     res.json({
//       firstName: profile.firstName,
//       lastName: profile.lastName,
//       email: profile.email,
//       phoneNumber: profile.phoneNumber,
//       dateOfBirth: profile.dateOfBirth,
//       bio: profile.bio,
//       country: profile.country,
//       city: profile.city
//     });
//   } catch (err) {
//     console.error('Error while fetching profile:', err); // Log the error for debugging
//     res.status(500).send('Failed to retrieve profile. Please try again.');
//   }
// });


  
// router.delete('/api/incomes/:id', async (req, res) => {
  
//     try {
//       const { id } = req.params;
//       const deletedIncome = await Income.findByIdAndDelete(id);
  
//       if (!deletedIncome) {
//         return res.status(404).json({ error: 'Income not found' });
//       }
  
//       res.status(200).json({ message: 'Income deleted successfully', income: deletedIncome });
//     } catch (error) {
//       console.error('Error deleting income:', error);
//       res.status(500).json({ error: 'Failed to delete income transaction' });
//     }
//   });

// module.exports = router;
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
