const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const managerRouter = require('../routes/managerRouter'); 
const Expense = require('../schemas/expense');
const User = require('../schemas/user'); 
const ExpensesService = require('../services/ExpensesService');

jest.mock('../schemas/expense'); 
jest.mock('../schemas/user'); 
beforeEach(() => {
    jest.spyOn(ExpensesService, 'getExpenses').mockResolvedValue([]); 
});

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
    date: new Date().toISOString(),  
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
    const mockExpense = {
        id: "1",
        description: "Business trip expenses",
        amount: 500,
        status: "pending",
        date: "2024-12-10T11:06:29.407Z",
        user: "456"
    };
    ExpensesService.getExpenses.mockResolvedValueOnce([mockExpense]); 

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
    ExpensesService.getExpenses.mockResolvedValueOnce([]); // Simulate no pending expenses

    const response = await request(app)
        .get('/api/manager/requests/users')
        .set('Authorization', `Bearer ${managerToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No pending expenses found');
});


test('GET /api/manager/requests/users - Should handle database errors gracefully', async () => {
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
    const invalidToken = 'invalid.token.here';  
  
    const response = await request(app)
      .get('/api/manager/requests/users')  
      .set('Authorization', `Bearer ${invalidToken}`)  
      .send(); 
  
    expect(response.status).toBe(403); 
    expect(response.body.message).toBe('Invalid token');  
  });
  
  
});
