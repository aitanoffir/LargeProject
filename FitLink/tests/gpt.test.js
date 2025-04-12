// tests/gpt.test.js
import dotenv from 'dotenv';
dotenv.config();

import { generateWorkoutPlan } from '../backend/controllers/gpt.controller.js';

const TEST_JWT = process.env.TEST_JWT;

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('GPT Controller', () => {
  it('should generate a valid workout plan from OpenAI API', async () => {
    const req = {
      body: {
        goal: 'build muscle',
        experience: 'intermediate',
        days: ['Monday', 'Wednesday', 'Friday'],
        style: 'push/pull/legs'
      }
    };
    const res = mockRes();

    await generateWorkoutPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        workoutPlan: expect.any(Array)
      })
    );

    // Optional: Log output to see actual response format
    // console.log(res.json.mock.calls[0][0]);
  }, 20000); // Increase timeout if needed for GPT-4
});
