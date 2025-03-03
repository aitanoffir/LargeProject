import Account from "../models/accounts.model.js";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
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

export const signUp = async (req, res) => {
    const account = req.body; //user will send this data
    const { username, password, firstName, lastName } = req.body;
    if (!account.username || !account.password || !account.firstName || !account.lastName) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    account.password = bcrypt.hashSync(account.password, 10);

    const newAccount = new Account(account);

    try{
        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.status(409).json({ 
                success: false, 
                message: "Account with this username already exists" 
            });
        }

        await newAccount.save();

        const payload = {
            name:username
        }
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        })
        
        res.status(201).json({ success: true, data: newAccount, jwt: token });
    } catch (error) {
        console.error("Error in Create product: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};


