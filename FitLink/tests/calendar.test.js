// tests/calendar.test.js
import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
const BASE_URL = 'http://localhost:7000';

const TEST_JWT_GOOGLE = process.env.TEST_JWT_GOOGLE;

let createdEventId = null;

const testEvent = {
  summary: 'Workout with Luke',
  location: 'Zoom',
  description: 'Chest and triceps day',
  start: {
    dateTime: new Date(Date.now() + 3600000).toISOString(),
  },
  end: {
    dateTime: new Date(Date.now() + 7200000).toISOString(),
  },
};

const updatedEvent = {
  summary: 'Updated Workout with Luke',
  description: 'Now focusing on legs and abs',
  start: {
    dateTime: new Date(Date.now() + 10800000).toISOString(),
  },
  end: {
    dateTime: new Date(Date.now() + 14400000).toISOString(),
  },
};

describe('Google Calendar API - Real Integration', () => {
  it('should create a new calendar event', async () => {
    const res = await request(BASE_URL)
      .post('/api/accounts/calendar/event')
      .set('Authorization', `Bearer ${TEST_JWT_GOOGLE}`)
      .send(testEvent);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.event).toBeDefined();
    createdEventId = res.body.event.id;
  });

  it('should update the calendar event', async () => {
    const res = await request(BASE_URL)
      .put(`/api/accounts/calendar/event/${createdEventId}`)
      .set('Authorization', `Bearer ${TEST_JWT_GOOGLE}`)
      .send(updatedEvent);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.event.summary).toBe(updatedEvent.summary);
  });

  it('should retrieve calendar events', async () => {
    const res = await request(BASE_URL)
      .get('/api/accounts/calendar/events')
      .set('Authorization', `Bearer ${TEST_JWT_GOOGLE}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.events)).toBe(true);
  });

  it('should delete the calendar event', async () => {
    const res = await request(BASE_URL)
      .delete(`/api/accounts/calendar/event/${createdEventId}`)
      .set('Authorization', `Bearer ${TEST_JWT_GOOGLE}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Event deleted');
  });
});
