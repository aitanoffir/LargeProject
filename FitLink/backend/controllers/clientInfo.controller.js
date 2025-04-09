import ClientInfo from '../models/clientInfo.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {verifyJwt} from '../helpers.js';

//takes any clientInfo parameter as a URL query parameter and returns all valid clients
export const getClientAccountInfo = async (req, res) => {
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
                if (key === "id") { //id is an ObjectID so must be handled specially
                    if (mongoose.Types.ObjectId.isValid(value)) {
                        searchQuery["_id"] = value;
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

        //find all clients that match the search query
        const clients = await ClientInfo.find(searchQuery);

        //if no clients found return error
        if (!clients.length) {
            return res.status(404).json({ success: false, message: "No clients found" });
        }
        
        //return success and the clients
        res.status(200).json({ success: true, clients });
    } catch (error) { //if an error occurs return server error
        console.error("Error fetching clients:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


//adds a new client with JSON params in the body
export const addClientAccountInfo = async (req, res) => {
    const client = req.body; //user will send this data

    //verify JWT is valid
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    //try to add the client
    try{
        //search by email if client exists, I figure the email will be unqiue per client so good way to avoid duplicates
        const existingClient = await ClientInfo.findOne({ email: client.email });
        if (existingClient) { //return error if email already exists
            return res.status(409).json({ 
                success: false, 
                message: "Client with this email already exists" 
            });
        }
        //create new client and save to database
        const newClientInfo = new ClientInfo(client);
        await newClientInfo.save();
        console.log("New Client " + client.firstName + " " + client.lastName + " added");
        res.status(201).json({ success: true, data: newClientInfo});
    } catch (error) { //error of some kind
        console.error("Error in Add Client Info: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};

//deletes a client by ID, will need to be in the request URL params
export const deleteClientAccountInfo = async (req, res) => {
    //verify JWT first
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    //get client ID from request URL params
    const clientId = req.params.id;
    
    //invalid ID
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
    }

    //try to delete the client
    try {
        const deletedClient = await ClientInfo.findByIdAndDelete(clientId);

        if (!deletedClient) { //error finding client
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        //successful deletion
        res.status(200).json({
            success: true,
            message: "Client deleted successfully",
            deletedClient
        });
    } catch (error) {//error of some kind
        console.error("Error deleting client:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

//update client by ID, will need to be in the request URL params, better to update by ID to avoid any kind of duplicate issues
export const updateClientAccountInfo = async (req, res) => {
    const client = req.body; //user will send this data

    //verify JWT
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
    //get client ID from request URL params
    const clientId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
    }
    //get the fields to update
    const {_id, ...updatedFields} = client;
    try{ //try to update client
        const result = await ClientInfo.updateOne({ _id: clientId }, {$set: updatedFields});
        if (result.matchedCount === 0) { //no matching client
            return res.status(409).json({ 
                success: false, 
                message: "No client with matching ID found" 
            });
        }

        if(result.modifiedCount == 0){ //none were modified but successful requests
            return res.status(200).json({
                success: true,
                message: "No changes were made"
            })
        }
        //if we made it here we've updated the client
        console.log(client.firstName + " " + client.lastName + " updated");
        res.status(201).json({ success: true, data: "Client updated"});
    } catch (error) { //error of some kind
        console.error("Error in Update Client Info: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};

export const addClientNote = async (req, res) => {
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) return res.status(401).json({ success: false, message: "Invalid Token" });

    try {
        const client = await ClientInfo.findById(req.params.clientId);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });

        const newNote = {
            title: req.body.title,
            content: req.body.content
        };

        client.notes.push(newNote);
        const savedClient = await client.save();
        
        // Return the newly created note with ID
        const createdNote = savedClient.notes[savedClient.notes.length - 1];
        res.status(201).json({ 
            success: true, 
            note: createdNote 
        });

    } catch (error) {
        console.error("Error adding note:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateClientNote = async (req, res) => {
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) return res.status(401).json({ success: false, message: "Invalid Token" });

    try {
        const client = await ClientInfo.findById(req.params.clientId);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });

        const note = client.notes.id(req.params.noteId);
        if (!note) return res.status(404).json({ success: false, message: "Note not found" });

        note.title = req.body.title;
        note.content = req.body.content;
        note.updatedAt = Date.now();

        await client.save();
        res.status(200).json({ 
            success: true, 
            note: note 
        });

    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteClientNote = async (req, res) => {
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) return res.status(401).json({ success: false, message: "Invalid Token" });

    try {
        const client = await ClientInfo.findById(req.params.clientId);
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });

        const noteExists = client.notes.some(n => n._id.equals(req.params.noteId));
        if (!noteExists) return res.status(404).json({ success: false, message: "Note not found" });

        client.notes.pull({ _id: req.params.noteId });
        await client.save();
        res.status(200).json({ 
            success: true, 
            message: "Note deleted" 
        });

    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};