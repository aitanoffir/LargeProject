import Account from "../models/accounts.model.js";
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

// Create reusable OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Helper function to get calendar instance for logged-in Google user
const getCalendarClient = async (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Make sure this is a Google-authenticated user
    if (decoded.loginType !== 'google'){
        console.log("Not a Google user:", decoded.loginType);
        return null;
    } 

    const user = await Account.findById(decoded.id);
    
    if (!user || user.authType !== 'google') {
        console.log("Missing user or access token.");
        return null;
      }

    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });

  } catch (err) {
    console.error("Auth error:", err.message);
    return null;
  }
};

// CREATE Event
export const createEvent = async (req, res) => {
  const calendar = await getCalendarClient(req);
  if (!calendar) return res.status(403).json({ success: false, message: "Unauthorized or not logged in with Google" });

  const event = req.body;

  try {
    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    res.status(201).json({ success: true, event: result.data });
  } catch (err) {
    console.error("Create error:", err.message);
    res.status(500).json({ success: false, message: "Failed to create event" });
  }
};

// READ Events
export const getEvents = async (req, res) => {
  const calendar = await getCalendarClient(req);
  if (!calendar) return res.status(403).json({ success: false, message: "Unauthorized or not logged in with Google" });

  try {
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      privateExtendedProperty: 'appId=fitlink'
    });

    res.status(200).json({ success: true, events: result.data.items });
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

// UPDATE Event
export const updateEvent = async (req, res) => {
  const calendar = await getCalendarClient(req);
  if (!calendar) return res.status(403).json({ success: false, message: "Unauthorized or not logged in with Google" });

  const { eventId } = req.params;
  const updatedEvent = req.body;

  try {
    const result = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: updatedEvent
    });

    res.status(200).json({ success: true, event: result.data });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};

// DELETE Event
export const deleteEvent = async (req, res) => {
  const calendar = await getCalendarClient(req);
  if (!calendar) return res.status(403).json({ success: false, message: "Unauthorized or not logged in with Google" });

  const { eventId } = req.params;

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId
    });

    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};
