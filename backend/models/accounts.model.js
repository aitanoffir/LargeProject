import mongoose from "mongoose";

const accountSignUp = mongoose.Schema({
    username:{
        type: String,
        required: true
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
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
}, 
{
    timestamps: true //createdAT and updatedAt
});

//create a model called Account and look at accountSignUp
//mongoose will create a collection called Accounts
const Account = mongoose.model('Account', accountSignUp);
// products
export default Account;