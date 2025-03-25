import mongoose from "mongoose";

const sessionNotes = mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clientInfo', //this matches the model name, not the collection name
        required: true,
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainerInfo', //this matches the model name, not the collection name
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    }      
});

const SessionNotes = mongoose.model('SessionNotes', sessionNotes);

export default SessionNotes;