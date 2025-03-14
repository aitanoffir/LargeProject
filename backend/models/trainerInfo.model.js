import mongoose from "mongoose";

const trainerInfoSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    county: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    certifications: {
        type: [String], // Array of certifications
        default: []
    },
    schedulingPreferences: {
        Monday: { type: [Object], default: [] },
        Tuesday: { type: [Object], default: [] },
        Wednesday: { type: [Object], default: [] },
        Thursday: { type: [Object], default: [] },
        Friday: { type: [Object], default: [] },
        Saturday: { type: [Object], default: [] },
        Sunday: { type: [Object], default: [] }
    },
    bio: {
        type: String
    },
    clients: [
        {
            client_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Client" // Assuming you have a Client model
            }
        }
    ]
}, 
{
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create a model called TrainerInfo
const TrainerInfo = mongoose.model('TrainerInfo', trainerInfoSchema, 'trainerInfo');

export default TrainerInfo;
