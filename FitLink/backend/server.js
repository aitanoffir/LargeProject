//const express = require('express'); //<--legacy version
import express from 'express'; //<-- modern version
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';



import accountRoutes from './routes/routes.js';

dotenv.config();

//start on port from .env file
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); //allows us to accept JSON data in the req.body
//^ middleware
//api endpoint
app.use("/api/accounts", accountRoutes);
// Load your swagger.yaml file
const swaggerDocument = YAML.load('./backend/swagger.yaml');

// Serve it at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//catch all undefined routes
app.all("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
//Postman

// Connect to the database before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server started at http://localhost:' + PORT);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});


