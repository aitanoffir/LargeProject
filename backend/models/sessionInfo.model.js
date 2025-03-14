import mongoose from "mongoose";

const sessionInfoSchema = new mongoose.Schema({
    trainer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainerInfo",
        required: true
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientInfo",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    focus: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, 
{
    timestamps: true
});

// Create model
const SessionInfo = mongoose.model("SessionInfo", sessionInfoSchema);

export default SessionInfo;
