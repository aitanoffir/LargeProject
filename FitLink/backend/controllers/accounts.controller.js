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
            name:email,
            loginType: 'fitlink',
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
            name:email,
            loginType: 'fitlink',
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

// Function to update the account information for the logged-in user
export const updateAccount = async (req, res) => {
    // Get token from request
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication required" });
    }

    try {
        // Decode the token to get email
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.name; // Email is stored as 'name' in your JWT

        // Fields to update
        const { firstName, lastName, phonenumber, bio } = req.body;
        
        // Find account by email
        const account = await Account.findOne({ email });
        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        // Update fields if provided
        if (firstName) account.firstName = firstName;
        if (lastName) account.lastName = lastName;
        if (phonenumber) account.phonenumber = phonenumber;
        if (bio) account.bio = bio;
        
        // Save the updated account
        await account.save();

        return res.status(200).json({ 
            success: true, 
            message: "Account updated successfully",
            data: account
        });
    } catch (error) {
        console.error("Error in Update account:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Add this function to get user profile data
export const getAccount = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.name;
      
      const account = await Account.findOne({ email });
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }
  
      res.status(200).json({
        success: true,
        profile: {
          email: account.email,
          firstName: account.firstName || "",
          lastName: account.lastName || "",
          phonenumber: account.phonenumber || "",
          bio: account.bio || ""
        }
      });
    } catch (error) {
      console.error("Error in Get account:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
