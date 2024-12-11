const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const ExpenseService = require("../services/ExpensesService");
const Expense = require('../schemas/expense');
const expenseRouter = require('../routes/expenseRouter'); 

jest.mock('../schemas/expense'); 
jest.mock('../services/ExpensesService'); 

const app = express();
app.use(express.json());
app.use('/api/expenses', expenseRouter);

const JWT_SECRET = 'Vkm123vkm$$$';
const userToken = jwt.sign({ userId: '456', role: 'employee' }, JWT_SECRET);
const invalidToken = 'invalid.token.here'; 

const mockExpense = {
  description: 'Business trip expenses',
  amount: 500,
  category: 'Travel',
  user: '456',
  status: 'pending',
};

describe('Expense Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/expenses - Should create a new expense', async () => {
    ExpenseService.createExpense.mockResolvedValueOnce(mockExpense);

    const response = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${userToken}`)
      .send(mockExpense);

    expect(response.status).toBe(201); 
    expect(response.body.description).toBe('Business trip expenses');
    expect(response.body.amount).toBe(500);
  });

  test('POST /api/expenses - Should return 401 for missing token', async () => {
    const response = await request(app)
      .post('/api/expenses')
      .send(mockExpense);

    expect(response.status).toBe(401); // Missing token should return 401
    expect(response.body.message).toBe('Access token required');
  });

  test('POST /api/expenses - Should return 403 for invalid token', async () => {
    const response = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(mockExpense);

    expect(response.status).toBe(403); // Invalid token should return 403
    expect(response.body.message).toBe('Invalid token');
  });

  expenseRouter.post('/', async (req, res) => {
  const { description, amount, category, status, user } = req.body;

  if (!description || description.trim() === '') {
    return res.status(400).json({ message: 'Description is required' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }
  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  if (!user) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const newExpense = await ExpenseService.createExpense(req.body);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

});
