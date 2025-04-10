import Notes from '../models/notes.model.js';
import mongoose from 'mongoose';
import {verifyJwt} from '../helpers.js';
import Account from '../models/accounts.model.js';

// Get notes for the current user
export const getNotes = async (req, res) => {
    // Verify JWT is valid
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
    try {
        // Get user ID from JWT or from userId in localStorage
        let userId = null;
        
        // First check if the token has a name field containing the email
        if (validToken.name) {
            const userEmail = validToken.name;
            const user = await Account.findOne({ email: userEmail });
            if (user) {
                userId = user._id;
            }
        }
        
        // If we still don't have a userId, try to get it from request
        if (!userId && req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
            userId = req.query.userId;
        }
        
        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Set up search query with the user ID
        let searchQuery = { user: userId };
        
        // Add any additional filters
        if (req.query.id && mongoose.Types.ObjectId.isValid(req.query.id)) {
            searchQuery._id = req.query.id;
        }
        
        if (req.query.title) {
            searchQuery.title = { $regex: new RegExp(req.query.title, "i") };
        }
        
        if (req.query.content) {
            searchQuery.content = { $regex: new RegExp(req.query.content, "i") };
        }
        
        // Find all notes that match the search query
        const notes = await Notes.find(searchQuery).sort({ updatedAt: -1 });
        
        // Return the notes
        res.status(200).json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create a new note
export const createNote = async (req, res) => {
    // Verify JWT is valid
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }
        
        // Get user ID from various possible sources
        let userId = null;
        
        // First try from token name (email)
        if (validToken.name) {
            const userEmail = validToken.name;
            const user = await Account.findOne({ email: userEmail });
            if (user) {
                userId = user._id;
            }
        }
        
        // If still no userId, try body or headers
        if (!userId) {
            if (req.body.userId && mongoose.Types.ObjectId.isValid(req.body.userId)) {
                userId = req.body.userId;
            } else if (req.headers['user-id'] && mongoose.Types.ObjectId.isValid(req.headers['user-id'])) {
                userId = req.headers['user-id'];
            }
        }
        
        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Create new note with user ID reference
        const newNote = new Notes({
            user: userId,
            title,
            content,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await newNote.save();
        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

// Delete a note by ID
export const deleteNote = async (req, res) => {
    // Verify JWT first
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
    // Get note ID from request URL params
    const noteId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    try {
        // Find the user account
        const userEmail = validToken.name;
        const user = await Account.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found" });
        }
        
        // Find the note and verify ownership
        const note = await Notes.findOne({ _id: noteId, user: user._id });
        
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found or you don't have permission" });
        }
        
        // Delete the note
        const deletedNote = await Notes.findByIdAndDelete(noteId);
        
        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            deletedNote
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update a note by ID
export const updateNote = async (req, res) => {
    // Verify JWT
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
    // Get note ID from request URL params
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ success: false, message: "Invalid note ID" });
    }
    
    try {
        // Find the user account
        const userEmail = validToken.name;
        const user = await Account.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found" });
        }
        
        // Verify ownership of the note
        const note = await Notes.findOne({ _id: noteId, user: user._id });
        
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found or you don't have permission" });
        }
        
        const { title, content } = req.body;
        const updateData = {
            ...(title && { title }),
            ...(content && { content }),
            updatedAt: new Date()
        };
        
        // Update the note
        const result = await Notes.updateOne({ _id: noteId }, {$set: updateData});
        
        if (result.modifiedCount === 0) {
            return res.status(200).json({
                success: true,
                message: "No changes were made"
            });
        }
        
        // Get the updated note
        const updatedNote = await Notes.findById(noteId);
        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
