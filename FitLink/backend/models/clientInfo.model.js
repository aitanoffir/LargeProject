import mongoose from "mongoose";

const clientInfoSchema = new mongoose.Schema({
    trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trainerInfo', //this matches the model name, not the collection name
            required: true,
        },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    weight: {
        type: Number,
        required: false
    },
    goalWeight: {
        type: Number,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    activityLevel: {
        type: String,
        enum: ['Sedentary', 'Slightly active', 'Moderately active', 'Very active'],
        required: false
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'N/A'],
        required: false,
    },
    sessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SessionNotes"
        }
    ],
    bio: {
        type: String
    }
}, 
{
    timestamps: true
});

// Create model
const ClientInfo = mongoose.model("ClientInfo", clientInfoSchema);

export default ClientInfo;
