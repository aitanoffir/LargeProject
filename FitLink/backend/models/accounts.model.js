import mongoose from "mongoose";

const accountSignUp = mongoose.Schema({
  username: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
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
  authType: {
    type: String,
    enum: ['google', 'fitlink'],
    default: 'fitlink'
  },
  googleAccessToken: {
    type: String
  },
  googleRefreshToken: {
    type: String
  }
}, {
  timestamps: true
});

const Account = mongoose.model('Account', accountSignUp);
export default Account;
