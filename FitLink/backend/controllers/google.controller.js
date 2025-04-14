
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
const LINK_REDIRECT_URI = 'http://localhost:7000/api/accounts/link/google/callback';

// Initiates the Google Login flow
export const googleLoginResponse = (req, res) => {
  const scope = encodeURIComponent('openid profile email https://www.googleapis.com/auth/calendar');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
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
  
      const { access_token, refresh_token } = data;
  
      // Fetch user profile using access_token
      const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      const { email, name } = profile;
  
      // Check if user exists, otherwise create new one
      let account = await Account.findOne({ email });
  
      if (!account) {
        account = new Account({
          username: email,
          email: email,
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1] || '',
          authType: 'google',
          googleAccessToken: access_token,
          googleRefreshToken: refresh_token,
        });
        await account.save();
      } else {
        // If the account exists, you might want to update the tokens (if provided)
        if (access_token) account.googleAccessToken = access_token;
        if (refresh_token) account.googleRefreshToken = refresh_token;
        if (account.authType !== 'google') account.authType = 'google'; // Update authType if it was not Google
        await account.save();
      }
      
  
      // Create JWT
      const payload = {
        name: account.email,
        loginType: account.authType,
        id: account._id
      };
  
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
      //console.log("Login with Google JWT for testing: ", token);
      // Return JWT in response (optional: set as cookie)
      res.redirect(`http://localhost:5173/Home?token=${token}`);
  
    } catch (error) {
      console.error('Error during Google OAuth callback:', error?.response?.data || error.message);
      res.status(500).json({ success: false, message: "OAuth login failed" });
    }
  };

  export const googleLogout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully. Please clear token on client.' });
  };
  
  
export const verifyJWTLink = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ success: false, message: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Account.findOne({ email: decoded.name });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export const linkGoogleAccountInit = (req, res) => {
  const scope = encodeURIComponent(
    "openid profile email https://www.googleapis.com/auth/calendar"
  );
  const state = encodeURIComponent(req.user._id.toString());

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${LINK_REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

  res.status(200).json({ url });
};



  export const linkGoogleAccountCallback = async (req, res) => {
    const { code, state } = req.query;
  
    try {
      // 1. Exchange auth code for tokens
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: LINK_REDIRECT_URI,
        grant_type: 'authorization_code',
      });
  
      const { access_token, refresh_token } = tokenRes.data;
  
      // 2. Get Google profile
      const profileRes = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
  
      const { email, id: googleId, name } = profileRes.data;
  
      // 3. Look up user by MongoDB ID from `state`
      const account = await Account.findById(state);
      if (!account) return res.status(404).json({ success: false, message: "User not found" });
  
      // 4. Prevent hijacking / conflicting links
      if (account.googleId && account.googleId !== googleId) {
        return res.status(400).json({ success: false, message: "Already linked to another Google account" });
      }
  
      // 5. Update and save the account
      account.authType = 'google';
      account.googleId = googleId;
      account.googleAccessToken = access_token;
      if (refresh_token) account.googleRefreshToken = refresh_token;
      await account.save();
  
      // 6. Create JWT and redirect to frontend
      const payload = {
        name: account.email,
        loginType: 'google',
        id: account._id
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log("Google token: ", token)
      // 7. Redirect with token to frontend Calendar
      res.redirect(`http://localhost:5173/Calendar?token=${token}`);
  
    } catch (error) {
      console.error("Google linking error:", error?.response?.data || error.message);
      res.status(500).json({ success: false, message: "Failed to link Google account" });
    }
  };
  