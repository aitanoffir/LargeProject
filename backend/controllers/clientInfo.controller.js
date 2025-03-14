import ClientInfo from '../models/clientInfo.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {verifyJwt} from '../helpers.js';


export const getClientAccountInfo = async (req, res) => {
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    try {
        let searchQuery = {};

        // Loop through all query parameters and build the search query dynamically
        Object.keys(req.query).forEach((key) => {
            if (req.query[key]) {
                if (key === "id") {
                    // Validate ID before adding to query
                    if (mongoose.Types.ObjectId.isValid(req.query[key])) {
                        searchQuery["_id"] = req.query[key];
                    } else {
                        return res.status(400).json({ success: false, message: "Invalid client ID" });
                    }
                } else {
                    // Case-insensitive search for string fields
                    searchQuery[key] = { $regex: new RegExp(req.query[key], "i") };
                }
            }
        });

        if (Object.keys(searchQuery).length === 0) {
            return res.status(400).json({ success: false, message: "Provide at least one search parameter" });
        }

        const clients = await ClientInfo.find(searchQuery);

        if (!clients.length) {
            return res.status(404).json({ success: false, message: "No clients found" });
        }

        res.status(200).json({ success: true, clients });
    } catch (error) {
        console.error("Error fetching clients:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



export const addClientAccountInfo = async (req, res) => {
    const client = req.body; //user will send this data
    const validToken = verifyJwt(req.headers.authorization);
    if (!validToken) {
        console.log("Invalid Token");
        console.log(req.headers.authorization);
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    try{
        const existingClient = await ClientInfo.findOne({ email: client.email });
        if (existingClient) {
            return res.status(409).json({ 
                success: false, 
                message: "Client with this email already exists" 
            });
        }
        const newClientInfo = new ClientInfo(client);
        await newClientInfo.save();
        console.log("New Client " + client.firstName + " " + client.lastName + " added");
        res.status(201).json({ success: true, data: newClientInfo});
    } catch (error) {
        console.error("Error in Add Client Info: ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};


