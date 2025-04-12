// tests/client.test.js
import dotenv from 'dotenv';
dotenv.config();

import { addClientAccountInfo, getClientAccountInfo, updateClientAccountInfo, deleteClientAccountInfo } from '../backend/controllers/clientInfo.controller.js';
import ClientInfo from '../backend/models/clientInfo.model.js';
import { verifyJwt } from '../backend/helpers.js';
import mongoose from 'mongoose';

jest.mock('../backend/models/clientInfo.model.js');
jest.mock('../backend/helpers.js');

const TEST_JWT = process.env.TEST_JWT;

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

let createdClientId = null;

const newClientPayload = {
  trainer: "67c626423a12ce4f5079e16f",
  firstName: "John",
  lastName: "Smith",
  email: "client7@example.com",
  phoneNumber: "987-654-3210",
  sessions: [],
  bio: "I am looking to lose weight and build muscle while improving my endurance.",
  color: "#7CC9F7",
  notes: [],
  workoutSchedule: []
};

describe('Client Controller Full Flow', () => {
  beforeEach(() => {
    verifyJwt.mockReturnValue(true);
    mongoose.Types.ObjectId.isValid = () => true;
    jest.clearAllMocks();
  });

  it('should create a new client', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      body: newClientPayload
    };
    const res = mockRes();

    const mockSavedClient = {
      ...newClientPayload,
      _id: 'mock-client-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };

    ClientInfo.findOne.mockResolvedValue(null);
    const mockSave = jest.fn().mockResolvedValue(mockSavedClient);
    function ClientInfoMock(data) {
        Object.assign(this, data);
        this.save = mockSave;
      }
      ClientInfo.mockImplementation(ClientInfoMock);
      

    await addClientAccountInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockSavedClient });
    createdClientId = mockSavedClient._id;
  });

  it('should fetch client by ID', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      query: { id: createdClientId }
    };
    const res = mockRes();

    ClientInfo.find.mockResolvedValue([{
      _id: createdClientId,
      ...newClientPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    }]);

    await getClientAccountInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, clients: expect.any(Array) });
  });

  it('should update the client info', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      params: { id: createdClientId },
      body: { firstName: 'Updated', lastName: 'Name' }
    };
    const res = mockRes();
    ClientInfo.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 });

    await updateClientAccountInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: 'Client updated' });
  });

  it('should delete the client', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      params: { id: createdClientId }
    };
    const res = mockRes();
    ClientInfo.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: createdClientId });

    await deleteClientAccountInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Client deleted successfully',
      deletedClient: { _id: createdClientId }
    });
  });
});
