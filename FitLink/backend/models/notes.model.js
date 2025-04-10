import mongoose from "mongoose";

const notesSchema = mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainerInfo', //this matches the model name, not the collection name
        required: true,
    },
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
});

const Notes = mongoose.model('Notes', notesSchema);

export default Notes;
