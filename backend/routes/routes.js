import express from "express";

import { signUp, login } from "../controllers/accounts.controller.js";

const router = express.Router();

router.post("/", signUp);
router.get("/", login);



export default router;

