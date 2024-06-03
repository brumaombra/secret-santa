import dotenv from 'dotenv';
import express from 'express';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import { drawPairs } from '../utils/draw.js';
import { sendEmails } from '../utils/email.js';
dotenv.config(); // Load the .env file

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// Serve the public folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public')));

// Draw the pairs
app.post('/api/draw', (req, res) => {
    const { lang, participants } = req.body; // Get language and participants from the request body
    try {
        const pairs = drawPairs(participants, lang); // Attempt to draw pairs
        const messagges = sendEmails(pairs); // Send the emails
        if (!pairs) throw new Error('Impossible to find the pairs'); // Handle case where no pairs can be drawn
        res.json({ status: 'OK', message: 'Pairs extracted successfully', messaggeList: messagges, pairs }); // Send the successful response with the drawn pairs
    } catch (error) {
        const errorMessage = error.message || 'Error while extracting the pairs';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error response
    }
});

// Middleware for handling exceptions and errors globally
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ status: 'KO', message: 'Internal Server Error' });
});

// Every other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Start the HTTPS server
const startHttpsServer = () => {
    const httpsOptions = { // Load the SSL certificate
        key: fs.readFileSync('/etc/letsencrypt/live/bruma.cloud/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/bruma.cloud/fullchain.pem')
    };

    // Start the HTTPS server
    https.createServer(httpsOptions, app).listen(port, () => {
        console.log(`Web server listening on HTTPS port ${port}`);
    });
};

// Initialize the web server
export const initWebServer = () => {
    try {
        startHttpsServer(); // Start the HTTPS server
    } catch (error) {
        console.error('Error while starting the HTTPS server, starting the HTTP server...');
        app.listen(port, () => { // Start the server without HTTPS
            console.log(`Web server listening on port ${port}`);
        });
    }
};