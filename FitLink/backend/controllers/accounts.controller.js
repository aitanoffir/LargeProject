import Account from "../models/accounts.model.js";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//login function
export const login = async (req, res) => {
    //get username and password from request body
    const { email, password } = req.body;
    try {
        //find matching username
        const account = await Account.findOne({ email });
        //if no account found return invalid credentials
        if (!account) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        //check hashed passwords against each other
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        //create JWT token
        const payload = {
            name:email
        }
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        })
        
        //return account and token
        res.status(200).json({ success: true, data: account, jwt: token });
    } catch (error) { //some kind of server error
        console.log("Error in Fetch accounts: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

//sign up function
export const signUp = async (req, res) => {
    const account = req.body; //user will send this data
    const { email, password  } = req.body; //required fields in sign up
    if (!account.email || !account.password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    //encrypt password and create newAccount variable
    account.password = bcrypt.hashSync(account.password, 10);
    const newAccount = new Account(account);
    //try to save new account
    try{
        const existingAccount = await Account.findOne({ email });
        if (existingAccount) { //check if account already exists by email
            return res.status(409).json({ 
                success: false, 
                message: "Account with this email already exists" 
            });
        }
        //save new account to database
        await newAccount.save();

        //generate and return JWT 
        const payload = {
            name:email
        }
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
        })
        
        res.status(201).json({ success: true, data: newAccount, jwt: token });
    } catch (error) { //some kind of server error
        console.error("Error in Create product: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};
