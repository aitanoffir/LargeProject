// tests/workout.test.js
import dotenv from 'dotenv';
dotenv.config();

import {
  createWorkout,
  updateWorkout,
  getWorkoutByClientId,
  deleteWorkout
} from '../backend/controllers/workout.controller.js';

import Workout from '../backend/models/workout.model.js';
import { verifyJwt } from '../backend/helpers.js';
import mongoose from 'mongoose';

jest.mock('../backend/models/workout.model.js');
jest.mock('../backend/helpers.js');

const TEST_JWT = process.env.TEST_JWT;

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

let createdWorkoutId = 'mock-workout-id';
let testClientId = 'mock-client-id';

const workoutPayload = {
  clientId: testClientId,
  goal: 'build muscle',
  experience: 'intermediate',
  days: 3,
  style: 'push/pull/legs split',
  workoutPlan: [
    {
      day: 'Monday',
      focus: 'Push',
      exercises: [
        { name: 'Bench Press', sets: 3, reps: '10' },
        { name: 'Shoulder Press', sets: 3, reps: '10' }
      ],
      notes: 'Focus on form'
    }
  ]
};

describe('Workout Controller Full Flow', () => {
  beforeEach(() => {
    verifyJwt.mockReturnValue(true);
    mongoose.Types.ObjectId.isValid = () => true;
    jest.clearAllMocks();
  });

  it('should create a workout plan', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      body: workoutPayload
    };
    const res = mockRes();

    Workout.findOne.mockResolvedValue(null);
    const mockSave = jest.fn().mockResolvedValue({ ...workoutPayload, _id: createdWorkoutId });

    function WorkoutMock(data) {
      Object.assign(this, data);
      this.save = mockSave;
    }
    Workout.mockImplementation(WorkoutMock);

    await createWorkout(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.objectContaining(workoutPayload) });
  });

  it('should retrieve workout by client ID', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      params: { clientId: testClientId }
    };
    const res = mockRes();

    Workout.findOne.mockResolvedValue({ ...workoutPayload, _id: createdWorkoutId });

    await getWorkoutByClientId(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.objectContaining(workoutPayload) });
  });

  it('should update the workout', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      params: { workoutId: createdWorkoutId },
      body: { goal: 'cut fat' }
    };
    const res = mockRes();

    Workout.findByIdAndUpdate.mockResolvedValue({ ...workoutPayload, ...req.body });

    await updateWorkout(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.objectContaining({ goal: 'cut fat' }) });
  });

  it('should delete the workout', async () => {
    const req = {
      headers: { authorization: `Bearer ${TEST_JWT}` },
      params: { workoutId: createdWorkoutId }
    };
    const res = mockRes();

    Workout.findByIdAndDelete.mockResolvedValue({ _id: createdWorkoutId });

    await deleteWorkout(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Workout deleted successfully',
      data: { _id: createdWorkoutId }
    });
  });
});
