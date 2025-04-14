import express from "express";

import { signUp, login, updateAccount, getAccount, syncPassword } from "../controllers/accounts.controller.js";
import { addTrainerAccountInfo, getTrainerAccountInfo } from "../controllers/trainerInfo.controller.js";
import { addClientAccountInfo, getClientAccountInfo, deleteClientAccountInfo, updateClientAccountInfo } from "../controllers/clientInfo.controller.js";
import { googleLoginResponse, googleLoginCallback, googleLogout, linkGoogleAccountInit, linkGoogleAccountCallback, verifyJWTLink } from "../controllers/google.controller.js";
import { addSessionNotesInfo, getSessionNotesInfo, deleteSessionNotesInfo, updateSessionNotesInfo } from "../controllers/sessionNotes.controller.js";
import { generateWorkoutPlan } from "../controllers/gpt.controller.js";
import { createWorkout, updateWorkout, getWorkoutByClientId, deleteWorkout } from "../controllers/workout.controller.js";
import { addClientNote, updateClientNote, deleteClientNote } from '../controllers/clientInfo.controller.js';
import {createEvent, getEvents, updateEvent, deleteEvent} from "../controllers/googleCalendar.controller.js";

const router = express.Router();

//signup and login routes
router.post("/", signUp); //sign up creates a trainer account
router.post("/login", login); //login logs a trainer in
router.put("/update", updateAccount); // Updates account information
router.get("/get", getAccount); // Gets account information
router.post('/sync-password', syncPassword);

//trainer accounts info (optional) NOT BEING USED IGNORE
router.post("/trainer", addTrainerAccountInfo); //where we add trainer account info
router.get("/trainer", getTrainerAccountInfo); //gets trainer account info  STILL NEEDS TO BE DONE

//client CRUD functionality
router.post("/client", addClientAccountInfo); //where we add client account info
router.get("/client", getClientAccountInfo); //gets trainer client info
router.delete("/client/:id", deleteClientAccountInfo); // deleted a client by _id
router.put("/client/:id", updateClientAccountInfo); //updates a client by _id

//Client Notes functionality
router.post('/client/:clientId/notes', addClientNote);
router.put('/client/:clientId/notes/:noteId',  updateClientNote);
router.delete('/client/:clientId/notes/:noteId', deleteClientNote);

//session CRUD functionality <--UNUSED
router.post("/session", addSessionNotesInfo); //where we add session notes info
router.get("/session", getSessionNotesInfo); //gets session notes info
router.delete("/session/:id", deleteSessionNotesInfo); // deletes a session by _id
router.put("/session/:id", updateSessionNotesInfo); //updates a session by _id

//login with google oauth routes
router.get("/auth/google", googleLoginResponse);
router.get("/auth/google/callback", googleLoginCallback);
router.get("/auth/google/logout", googleLogout);

//in-session Google account linking
router.get("/link/google/init", verifyJWTLink, linkGoogleAccountInit); // Link Google Account
router.get("/link/google/callback", linkGoogleAccountCallback); // Callback after linking Google Account

// Add this route to handle GPT-based workout plan generation
router.post("/generate-workout", generateWorkoutPlan);

//workout CRUD functionality
router.post("/workouts", createWorkout); // Create a new workout
router.put("/workouts/:workoutId", updateWorkout); // Update an existing workout
router.get("/workouts/client/:clientId", getWorkoutByClientId); // Get a workout by clientId
router.delete("/workouts/:workoutId", deleteWorkout); // Delete a workout

// Google Calendar routes
router.post("/calendar/event", createEvent); // Create event
router.get("/calendar/events", getEvents); // Get events
router.put("/calendar/event/:eventId", updateEvent); // Update event
router.delete("/calendar/event/:eventId", deleteEvent); // Delete event

export default router;

