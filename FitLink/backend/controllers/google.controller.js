
import express from 'express';
import axios from 'axios';
const router = express.Router();
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Account from '../models/accounts.model.js'; // assuming you're using the same user model

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:7000/api/accounts/auth/google/callback';

// Initiates the Google Login flow
export const googleLoginResponse = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid profile email`;
  console.log("Attempting to login with Google");
  res.redirect(url);
};
export const googleLoginCallback = async (req, res) => {
    const { code } = req.query;
  
    try {
      // Exchange authorization code for access token
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      });
  
      const { access_token } = data;
  
      // Fetch user profile using access_token
      const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      const { email, name } = profile;
  
      // Check if user exists, otherwise create new one
      let account = await Account.findOne({ username: email });
  
      if (!account) {
        account = new Account({
          username: email,
          email: email,
          password: 'google-oauth-placeholder', // won't be used, just satisfies schema
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1] || '',
          authType: 'google',
        });
      
        await account.save();
      }
      
  
      // Create JWT
      const payload = {
        name: account.username,
        id: account._id
      };
  
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
  
      // Return JWT in response (optional: set as cookie)
      res.status(200).json({ success: true, data: account, jwt: token });
  
    } catch (error) {
      console.error('Error during Google OAuth callback:', error?.response?.data || error.message);
      res.status(500).json({ success: false, message: "OAuth login failed" });
    }
  };

  export const googleLogout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully. Please clear token on client.' });
  };
  
  


  