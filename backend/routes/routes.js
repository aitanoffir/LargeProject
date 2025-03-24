import express from "express";

import { signUp, login } from "../controllers/accounts.controller.js";
import { addTrainerAccountInfo, getTrainerAccountInfo } from "../controllers/trainerInfo.controller.js";
import { addClientAccountInfo, getClientAccountInfo, deleteClientAccountInfo, updateClientAccountInfo } from "../controllers/clientInfo.controller.js";
import { googleLoginResponse, googleLoginCallback, googleLogout } from "../controllers/google.controller.js";
import { addSessionNotesInfo, getSessionNotesInfo, deleteSessionNotesInfo, updateSessionNotesInfo } from "../controllers/sessionNotes.controller.js";

const router = express.Router();

//signup and login routes
router.post("/", signUp); //sign up creates a trainer account
router.get("/", login); //login logs a trainer in

//trainer accounts info (optional)
router.post("/trainer", addTrainerAccountInfo); //where we add trainer account info
router.get("/trainer", getTrainerAccountInfo); //gets trainer account info  STILL NEEDS TO BE DONE

//client CRUD functionality
router.post("/client", addClientAccountInfo); //where we add client account info
router.get("/client", getClientAccountInfo); //gets trainer client info
router.delete("/client/:id", deleteClientAccountInfo); // deleted a client by _id
router.put("/client/:id", updateClientAccountInfo); //updates a client by _id

//session CRUD functionality
router.post("/session", addSessionNotesInfo); //where we add session notes info
router.get("/session", getSessionNotesInfo); //gets session notes info
router.delete("/session/:id", deleteSessionNotesInfo); // deletes a session by _id
router.put("/session/:id", updateSessionNotesInfo); //updates a session by _id

//login with google oauth routes
router.get("/auth/google", googleLoginResponse);
router.get("/auth/google/callback", googleLoginCallback);
router.get("/auth/google/logout", googleLogout);



export default router;

