import express from "express";

import { signUp, login } from "../controllers/accounts.controller.js";
import { addTrainerAccountInfo, getTrainerAccountInfo } from "../controllers/trainerInfo.controller.js";
import { addClientAccountInfo, getClientAccountInfo } from "../controllers/clientInfo.controller.js";
import { googleLoginResponse, googleLoginCallback, googleLogout } from "../controllers/google.controller.js";

const router = express.Router();

router.post("/", signUp); //sign up creates a trainer account
router.get("/", login); //login logs a trainer in
router.post("/trainer", addTrainerAccountInfo); //where we add trainer account info
router.get("/trainer", getTrainerAccountInfo); //gets trainer account info  STILL NEEDS TO BE DONE
router.post("/client", addClientAccountInfo); //where we add trainer account info
router.get("/client", getClientAccountInfo); //gets trainer account info
router.get("/auth/google", googleLoginResponse);
router.get("/auth/google/callback", googleLoginCallback);
router.get("/auth/google/logout", googleLogout);



export default router;

