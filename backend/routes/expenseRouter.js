const express = require('express');
const Expense = require('../schemas/expense');
const ExpenseService = require("../services/ExpensesService");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Vkm123vkm$$$";

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();      
  });
};

// Get all expenses
router.get('/', authenticateToken,  async (req, res) => {
  try {
    const expenses = ExpenseService.getExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all expenses for a specific user by userId
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    // Fetch expenses filtered by userId
    const expenses = await Expense.find({ user: req.params.userId })
      .populate('user') // Populate user data
      .populate('group'); // Populate group data

    // Check if expenses exist for the user
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found for this user' });
    }

    res.json(expenses); // Return the found expenses
  } catch (err) {
    console.error('Error:', err);  // Add this for debugging
    res.status(500).json({ message: err.message });
  }
});


// Get a single expense by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const expense = new ExpenseService(req.params.id);
    const results = expense.getExpense()
    if (!results) return res.status(404).json({ message: 'Expense not found' });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newExpense = await  ExpenseService.createExpense(req.body);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update expense by ID (e.g., change status)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const expense = new ExpenseService(req.params.id);
    const updatedExpense = expense.updateExpense(req.body);
    if (!updatedExpense) {
      return res.status(404).json({message: 'Expense not found'});
    }
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete expense by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const expense = new ExpenseService(req.params.id);
    const deletedExpense = await expense.deleteExpense();
    if (!deletedExpense)
      return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
