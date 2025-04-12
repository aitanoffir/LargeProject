// tests/sessionNotes.test.js
import dotenv from 'dotenv';
dotenv.config();

import {
  addSessionNotesInfo,
  getSessionNotesInfo,
  updateSessionNotesInfo,
  deleteSessionNotesInfo
} from '../backend/controllers/sessionNotes.controller.js';
import SessionNotes from '../backend/models/sessionNotes.model.js';
import { verifyJwt } from '../backend/helpers.js';
import mongoose from 'mongoose';

jest.mock('../backend/models/sessionNotes.model.js');
jest.mock('../backend/helpers.js');

const TEST_JWT = process.env.TEST_JWT;

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

let createdSessionId = 'mock-session-id';

const newSessionPayload = {
  client: 'mock-client-id',
  trainer: 'mock-trainer-id',
  date: new Date().toISOString(),
  title: 'Leg Day',
  notes: 'Focused on quads and hamstrings.'
};

describe('SessionNotes Controller Full Flow', () => {
  beforeEach(() => {
    verifyJwt.mockReturnValue(true);
    mongoose.Types.ObjectId.isValid = () => true;
    jest.clearAllMocks();
  });

  it('should create a new session note', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      body: newSessionPayload
    };
    const res = mockRes();

    const mockSavedSession = {
      ...newSessionPayload,
      _id: createdSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };

    const mockSave = jest.fn().mockResolvedValue(mockSavedSession);
    function SessionNotesMock(data) {
      Object.assign(this, data);
      this.save = mockSave;
    }
    SessionNotes.mockImplementation(SessionNotesMock);

    await addSessionNotesInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.objectContaining(newSessionPayload) });

    createdSessionId = mockSavedSession._id;
  });

  it('should fetch sessions by client ID', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      query: { client: newSessionPayload.client }
    };
    const res = mockRes();

    SessionNotes.find.mockResolvedValue([{
      ...newSessionPayload,
      _id: createdSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    }]);

    await getSessionNotesInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, sessions: expect.any(Array) });
  });

  it('should update the session note', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      params: { id: createdSessionId },
      body: { title: 'Updated Title', notes: 'Updated content.' }
    };
    const res = mockRes();

    SessionNotes.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 });

    await updateSessionNotesInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: 'Session updated' });
  });

  it('should delete the session note', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      params: { id: createdSessionId }
    };
    const res = mockRes();

    SessionNotes.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: createdSessionId });

    await deleteSessionNotesInfo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Session deleted successfully',
      deletedSession: { _id: createdSessionId }
    });
  });
});
