import mongoose from "mongoose";

const accountSignUp = mongoose.Schema({
    username:{
        type: String,
        required: false
    },
    password:{
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    phonenumber:{
        type: String,
        required: false
    },
    bio:{
        type: String,
        required: false
    }
}, 
{
    timestamps: true //createdAT and updatedAt
});

//create a model called Account and look at accountSignUp
//mongoose will create a collection called Accounts
const Account = mongoose.model('Account', accountSignUp);
// products
export default Account;