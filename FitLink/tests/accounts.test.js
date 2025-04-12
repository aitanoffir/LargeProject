// tests/accounts.test.js
import dotenv from 'dotenv';
dotenv.config();

import { signUp, login, updateAccount, getAccount } from '../backend/controllers/accounts.controller.js';
import jwt from 'jsonwebtoken';
import Account from '../backend/models/accounts.model.js';
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
jest.mock('../backend/models/accounts.model.js');

const TEST_JWT = process.env.TEST_JWT;

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Account Controller - signUp', () => {
  it('should return 400 if email or password missing', async () => {
    const req = { body: { email: '', password: '' } };
    const res = mockRes();
    await signUp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Please provide all fields' });
  });
});

describe('Account Controller - login', () => {
  it('should return 401 if account not found', async () => {
    const req = { body: { email: 'none@test.com', password: 'wrongpass' } };
    const res = mockRes();
    const originalFindOne = jest.spyOn(require('../backend/models/accounts.model.js'), 'default').mockReturnValue({ findOne: () => null });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    originalFindOne.mockRestore();
  });
  it('should return 200 with valid credentials', async () => {
    const req = { body: { email: 'test@gmail.com', password: 'test1234' } };
    const res = mockRes();

    const fakeAccount = {
      email: 'test@gmail.com',
      password: await bcrypt.hash('test', 10),
      _id: 'abc123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      authType: 'fitlink',
    };

    Account.findOne.mockResolvedValue(fakeAccount);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-jwt-token');

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.anything(),
        jwt: 'fake-jwt-token'
      })
    );
  });
});

describe('Account Controller - updateAccount', () => {
  it('should return 401 for missing token', async () => {
    const req = { headers: {} };
    const res = mockRes();
    await updateAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('Account Controller - getAccount', () => {
  it('should return 401 for missing token', async () => {
    const req = { headers: {} };
    const res = mockRes();
    await getAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
