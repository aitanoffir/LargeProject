import SessionNotes from '../models/sessionNotes.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {verifyJwt} from '../helpers.js';


//takes a sessionNotes ID and searches for it or can search for all sessions by client ID
export const getSessionNotesInfo = async (req, res) => {
    //verifies JWT is valid
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    //try our actual search functionality and return the results
    try {
        let searchQuery = {};

        // Loop through all query parameters and build the search query dynamically
        Object.keys(req.query).forEach((key) => {
            const value = req.query[key];
        
            if (value) {
                if (key === "id") { //id is an ObjectID so must be handled specially which represents session id
                    if (mongoose.Types.ObjectId.isValid(value)) {
                        searchQuery["_id"] = value;
                    } else {
                        return res.status(400).json({ success: false, message: "Invalid session ID" });
                    }
                } else if (key === "client") { //client is an ObjectID so must be handled specially
                    if (mongoose.Types.ObjectId.isValid(value)) {
                        searchQuery["client"] = value;
                    } else {
                        return res.status(400).json({ success: false, message: "Invalid client ID" });
                    }
                } else if (key === "trainer") { //trainer is an ObjectID so must be handled specially
                    if (mongoose.Types.ObjectId.isValid(value)) {
                        searchQuery["trainer"] = value;
                    } else {
                        return res.status(400).json({ success: false, message: "Invalid trainer ID" });
                    }
                } else {
                    // For name, email, etc.
                    searchQuery[key] = { $regex: new RegExp(value, "i") };
                }
            }
        });
        
        //if no params given we can't search so return error
        if (Object.keys(searchQuery).length === 0) {
            return res.status(400).json({ success: false, message: "Provide at least one search parameter" });
        }

        //find all sessions that match the search query
        const sessions = await SessionNotes.find(searchQuery);

        //if no sessions found return error
        if (!sessions.length) {
            return res.status(404).json({ success: false, message: "No sessions found" });
        }
        
        //return success and the sessions
        res.status(200).json({ success: true, sessions });
    } catch (error) { //if an error occurs return server error
        console.error("Error fetching sessions:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


//adds a new session note with JSON params in the body
export const addSessionNotesInfo = async (req, res) => {
    const session = req.body; //user will send this data

    //verify JWT is valid
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    //try to add the session
    try{
        
        //create new session and save to database
        const newsessionNotes = new SessionNotes(session);
        await newsessionNotes.save();
        console.log("New session added, id: " + newsessionNotes._id);
        res.status(201).json({ success: true, data: newsessionNotes});
    } catch (error) { //error of some kind
        console.error("Error in Add Session Info: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};

//deletes a session by ID, will need to be in the request URL params
export const deleteSessionNotesInfo = async (req, res) => {
    //verify JWT first
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    //get client ID from request URL params
    const sessionId = req.params.id;
    
    //invalid ID
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({ success: false, message: "Invalid session ID" });
    }

    //try to delete the session
    try {
        const deletedSession = await SessionNotes.findByIdAndDelete(sessionId);

        if (!deletedSession) { //error finding session
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        //successful deletion
        res.status(200).json({
            success: true,
            message: "Session deleted successfully",
            deletedSession
        });
    } catch (error) {//error of some kind
        console.error("Error deleting session:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

//update session by ID, will need to be in the request URL params, better to update by ID to avoid any kind of duplicate issues
export const updateSessionNotesInfo = async (req, res) => {
    const session = req.body; //user will send this data

    //verify JWT
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
    //get session ID from request URL params
    const sessionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({ success: false, message: "Invalid session ID" });
    }
    //get the fields to update
    const {_id, ...updatedFields} = session;
    try{ //try to update session
        const result = await SessionNotes.updateOne({ _id: sessionId }, {$set: updatedFields});
        if (result.matchedCount === 0) { //no matching client
            return res.status(409).json({ 
                success: false, 
                message: "No session with matching ID found" 
            });
        }

        if(result.modifiedCount == 0){ //none were modified but successful requests
            return res.status(200).json({
                success: true,
                message: "No changes were made"
            })
        }
        //if we made it here we've updated the session
        console.log("Session updated");
        res.status(201).json({ success: true, data: "Session updated"});
    } catch (error) { //error of some kind
        console.error("Error in Update Session Info: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};