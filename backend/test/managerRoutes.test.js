const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const managerRouter = require('../routes/managerRouter'); // Adjust path as needed
const Expense = require('../schemas/expense');
const User = require('../schemas/user'); // Assuming you have a User model
const ExpensesService = require('../services/ExpensesService');

jest.mock('../schemas/expense'); // Mock the Expense model
jest.mock('../schemas/user'); // Mock the User model
// Before each test, mock the ExpenseService methods
beforeEach(() => {
    jest.spyOn(ExpensesService, 'getExpenses').mockResolvedValue([]); // Mock to return an empty array
});

// After each test, clear mocks to prevent side effects
afterEach(() => {
    jest.restoreAllMocks();
});
const app = express();
app.use(express.json());
app.use('/api/manager', managerRouter);

const JWT_SECRET = 'Vkm123vkm$$$';
const managerToken = jwt.sign({ userId: '123', role: 'manager' }, JWT_SECRET);
const employeeToken = jwt.sign({ userId: '456', role: 'employee' }, JWT_SECRET);

const mockExpense = {
    id: '1',
    user: '456',
    description: 'Business trip expenses',
    amount: 500,
    date: new Date().toISOString(),  // Convert date to string (ISO format)
    status: 'pending',
  };
  

const mockManager = {
  id: '123',
  role: 'manager',
};

const mockEmployee = {
  id: '456',
  role: 'employee',
};

describe('Manager Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('GET /api/manager/requests/users - Should return pending expenses for manager', async () => {
    // Mock ExpenseService.getExpenses to return the mockExpense (array with one expense object)
    const mockExpense = {
        id: "1",
        description: "Business trip expenses",
        amount: 500,
        status: "pending",
        date: "2024-12-10T11:06:29.407Z",
        user: "456"
    };
    ExpensesService.getExpenses.mockResolvedValueOnce([mockExpense]); // Simulate returning pending expense

    const response = await request(app)
        .get('/api/manager/requests/users')
        .set('Authorization', `Bearer ${managerToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockExpense]); // Check that the response body matches the mockExpense
});

  

  test('GET /api/manager/requests/users - Should return 401 for missing token', async () => {
    const response = await request(app).get('/api/manager/requests/users');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token required');
  });

  test('GET /api/manager/requests/users - Should return 404 if no pending expenses exist', async () => {
    // Mock ExpenseService.getExpenses to return an empty array
    ExpensesService.getExpenses.mockResolvedValueOnce([]); // Simulate no pending expenses

    const response = await request(app)
        .get('/api/manager/requests/users')
        .set('Authorization', `Bearer ${managerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No pending expenses found');
});

  
  

test('GET /api/manager/requests/users - Should handle database errors gracefully', async () => {
    // Mock ExpenseService.getExpenses to simulate a database error by rejecting with an error
    ExpensesService.getExpenses.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
        .get('/api/manager/requests/users')
        .set('Authorization', `Bearer ${managerToken}`);

    // Ensure the status is 500 as expected for a database error
    expect(response.status).toBe(500);

    // Ensure the error message in the response is 'Internal server error'
    expect(response.body.message).toBe('Internal server error');
});





test('GET /api/manager/requests/users - Should return 403 if manager token is invalid', async () => {
    const invalidToken = 'invalid.token.here';  // Simulating an obviously invalid token
  
    const response = await request(app)
      .get('/api/manager/requests/users')  // Making the GET request
      .set('Authorization', `Bearer ${invalidToken}`)  // Set invalid token in Authorization header
      .send();  // No need to send any body for this test
  
    expect(response.status).toBe(403);  // Invalid token should result in 403 Forbidden
    expect(response.body.message).toBe('Invalid token');  // Ensure the error message is 'Invalid token'
  });
  
  
});
