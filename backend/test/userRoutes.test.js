const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRouter = require('../routes/userRouter'); 
const User = require('../schemas/user'); 

jest.mock('../schemas/user'); 

const app = express();
app.use(express.json());
app.use('/users', userRouter);

const JWT_SECRET = 'Vkm123vkm$$$';
const token = jwt.sign({ userId: '123', role: 'admin' }, JWT_SECRET);

const mockUser = {
  _id: '123',
  name: 'John Doe',
  email: 'johndoe@company.com',
  password: 'hashedpassword',
  role: 'employee',
};

describe('User Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users - Should fetch all users', async () => {
    User.find.mockResolvedValueOnce([mockUser]);

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockUser]);
  });

  test('GET /users/:id - Should fetch a single user', async () => {
    User.findById.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .get('/users/123')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  test('POST /users/login - Should log in a user and return a token', async () => {
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/users/login')
      .send({ email: 'johndoe@company.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual({
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    });
  });


  test('PUT /users/:id - Should update a user', async () => {
    const updatedUser = { ...mockUser, name: 'John Smith' };
    User.findByIdAndUpdate.mockResolvedValueOnce(updatedUser);

    const response = await request(app)
      .put('/users/123')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Smith' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUser);
  });

  test('DELETE /users/:id - Should delete a user', async () => {
    User.findByIdAndDelete.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .delete('/users/123')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted');
  });


});