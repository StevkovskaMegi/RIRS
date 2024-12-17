const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const managerRouter = require('../routes/managerRouter');
const ExpenseService = require('../services/ExpensesService');
const sendNotification = require('../utils/EmailService'); // Funkcija za pošiljanje e-pošte

jest.mock('../services/ExpensesService'); // Mockanje ExpensesService
jest.mock('../utils/emailService'); // Mockanje sendNotification

const app = express();
app.use(express.json());
app.use('/api/manager', managerRouter);

const JWT_SECRET = 'Vkm123vkm$$$';
const managerToken = jwt.sign({ userId: '123', role: 'manager' }, JWT_SECRET);
const mockExpense = {
  id: '1',
  user: { name: 'John Doe', email: 'johndoe@example.com' },
  description: 'Business trip expenses',
  amount: 500,
  date: new Date().toISOString(),
  status: 'pending',
};

describe('Manager Router', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Čistimo vse mocke pred vsakim testom
  });

  test('PUT /requests/:id/status - Should update expense status and send notification', async () => {
    // Mockanje posodobitve zahtevka
    ExpenseService.updateExpenseStatus = jest.fn().mockResolvedValue({
      ...mockExpense,
      status: 'approved', // Simuliramo posodobitev statusa
    });

    // Mockanje funkcije za pošiljanje e-pošte
    sendNotification.mockResolvedValue({ success: true });

    // Pošljemo PUT zahtevo za posodobitev statusa
    const response = await request(app)
      .put('/api/manager/requests/1/status')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });

    // Preverimo odgovor
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('approved');
    expect(ExpenseService.updateExpenseStatus).toHaveBeenCalledWith('1', 'approved');
    expect(sendNotification).toHaveBeenCalledWith(mockExpense.user, 'approved'); // Preverimo, da je bila funkcija za pošiljanje e-pošte poklicana
  });

  test('PUT /requests/:id/status - Should return error if expense request is not found', async () => {
    // Mockanje, da updateExpenseStatus vrne null (ni najden zahtev)
    ExpenseService.updateExpenseStatus.mockResolvedValue(null);

    const response = await request(app)
      .put('/api/manager/requests/999/status') // Napačen ID zahtevka
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Expense request not found');
  });

  test('PUT /requests/:id/status - Should handle errors when sending notification fails', async () => {
    // Mockanje uspešne posodobitve statusa
    ExpenseService.updateExpenseStatus.mockResolvedValue({
      ...mockExpense,
      status: 'approved',
    });

    // Mockanje napake pri pošiljanju e-pošte
    sendNotification.mockRejectedValue(new Error('Email sending failed'));

    const response = await request(app)
      .put('/api/manager/requests/1/status')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });

    expect(response.status).toBe(500); // Očakujemo napako pri pošiljanju e-pošte
    expect(response.body.message).toBe('Email sending failed');
  });

  test('PUT /requests/:id/status - Should return 403 if manager token is invalid', async () => {
    const invalidToken = 'invalid.token.here';  

    const response = await request(app)
      .put('/api/manager/requests/1/status')  
      .set('Authorization', `Bearer ${invalidToken}`)  
      .send({ status: 'approved' });

    expect(response.status).toBe(403); 
    expect(response.body.message).toBe('Invalid token');  
  });
});
