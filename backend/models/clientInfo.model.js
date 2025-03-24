import mongoose from "mongoose";

const clientInfoSchema = new mongoose.Schema({
    trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trainerInfo', //this matches the model name, not the collection name
            required: true,
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
    fitnessGoals: {
        type: [String],
        default: []
    },
    medicalConditions: {
        type: [String],
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
    preferredTrainers: [
        {
            trainer_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TrainerInfo"
            },
            trainerName: { type: String }
        }
    ],
    progress: {
        weight: {
            current: { type: Number },
            goal: { type: Number },
            unit: { type: String, default: "lbs" }
        },
        bodyFatPercentage: {
            current: { type: Number },
            goal: { type: Number }
        },
        strengthMetrics: [
            {
                exercise: { type: String, required: true },
                currentPR: { type: Number, required: true },
                goalPR: { type: Number, required: true },
                unit: { type: String, default: "lbs" }
            }
        ]
    },
    sessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SessionInfo"
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
