import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // Ensure each email is only used once
  },
  username: {
    type: String, // Optional, can be shown in UI
    required: false
  },
  password: {
    type: String,
    required: function () {
      return this.authType === 'fitlink';
    }
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  phonenumber: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },

  // Auth-related fields
  authType: {
    type: String,
    enum: ['google', 'fitlink'],
    default: 'fitlink'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // allows multiple nulls (only indexed if present)
  },
  googleAccessToken: {
    type: String,
    required: false
  },
  googleRefreshToken: {
    type: String,
    required: false
  }

}, {
  timestamps: true
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
