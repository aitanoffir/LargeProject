import TrainerInfo from "../models/trainerInfo.model.js";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {verifyJwt} from '../helpers.js';

//TODO: Implement this function
export const getTrainerAccountInfo = async (req, res) => {
    const { username, password } = req.body;
    try {
        //account.password = bcrypt.hashSync(account.password, 10);

        const account = await Account.findOne({ username });

        if (!account) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const payload = {
            name:username
        }
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        })
        

        res.status(200).json({ success: true, data: account, jwt: token });
    } catch (error) {
        console.log("Error in Fetch accounts: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const addTrainerAccountInfo = async (req, res) => {
    const trainer = req.body; //user will send this data
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    try{
        const exisitingTrainer = await TrainerInfo.findOne({ email: trainer.email });
        if (exisitingTrainer) {
            return res.status(409).json({ 
                success: false, 
                message: "Trainer with this email already exists" 
            });
        }
        const newTrainerInfo = new TrainerInfo(trainer);
        await newTrainerInfo.save();
        
        res.status(201).json({ success: true, data: newTrainerInfo});
    } catch (error) {
        console.error("Error in Add Trainer Info: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};


