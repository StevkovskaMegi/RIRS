const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const ExpenseService = require("../services/ExpensesService");
const Expense = require('../schemas/expense');
const expenseRouter = require('../routes/expenseRouter'); // Adjust path as needed

jest.mock('../schemas/expense'); // Mock the Expense model
jest.mock('../services/ExpensesService'); // Mock ExpenseService methods

// Initialize Express app and use the expense router
const app = express();
app.use(express.json());
app.use('/api/expenses', expenseRouter);

const JWT_SECRET = 'Vkm123vkm$$$';
const userToken = jwt.sign({ userId: '456', role: 'employee' }, JWT_SECRET);
const invalidToken = 'invalid.token.here'; // Simulate an invalid token

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
    // Mock ExpenseService.createExpense to return the mock expense
    ExpenseService.createExpense.mockResolvedValueOnce(mockExpense);

    const response = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${userToken}`)
      .send(mockExpense);

    expect(response.status).toBe(201); // Created status
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



  test('GET /api/expenses/:userId - Should return 401 for missing token', async () => {
    const response = await request(app).get('/api/expenses/456');

    expect(response.status).toBe(401); // Missing token should return 401
    expect(response.body.message).toBe('Access token required');
  });

  test('GET /api/expenses/:userId - Should return 403 for invalid token', async () => {
    const response = await request(app)
      .get('/api/expenses/456')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(403); // Invalid token should return 403
    expect(response.body.message).toBe('Invalid token');
  });

 


  test('GET /api/expenses/:id - Should return 401 for missing token', async () => {
    const response = await request(app).get('/api/expenses/1');

    expect(response.status).toBe(401); // Missing token should return 401
    expect(response.body.message).toBe('Access token required');
  });

  test('GET /api/expenses/:id - Should return 403 for invalid token', async () => {
    const response = await request(app)
      .get('/api/expenses/1')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(403); // Invalid token should return 403
    expect(response.body.message).toBe('Invalid token');
  });

});
