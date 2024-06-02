import dotenv from 'dotenv';
import express from 'express';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
dotenv.config(); // Load the .env file

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// Serve the public folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public')));

// Get the measurements
app.get('/api/measurements', async (req, res) => {
    try {
        const params = req.query; // Query parameters
        const measurements = await getMeasurements(params); // Get the measurements from the database
        res.json({ status: 'OK', data: measurements }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while reading the measurements';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ status: 'KO', message: errorMessage }); // Send the error message with status
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