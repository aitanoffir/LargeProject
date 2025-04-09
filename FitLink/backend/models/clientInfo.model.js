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
    age: {
        type: Number,
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
    },
    notes: [{
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    workoutSchedule: [{
        day: { 
            type: String, 
            enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] 
        },
        startTime: String,
        endTime: String
    }],
    color: {
        type: String,
        default: '#7CC9F7'
    },
}, 
{
    timestamps: true
});

// Create model
const ClientInfo = mongoose.model("ClientInfo", clientInfoSchema);

export default ClientInfo;
