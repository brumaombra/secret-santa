import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import routes from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config(); // Load the .env file

const port = 3001;
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors({ // Enable CORS
    origin: process.env.NODE_ENV === 'production' ? 'https://santa.bruma.cloud' : 'http://localhost:5173'
}));

// Initialize routes
routes(app);

// Serve the static folders
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public/app'))); // The web app
app.use('/assets', express.static(path.join(__dirname, '../../public/assets'))); // The assets for the email

// Middleware for handling exceptions and errors globally
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ message: 'Internal Server Error' });
});

// Every other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/app', 'index.html'));
});

// Start the web server
export const startWebServer = async () => {
    try {
        await new Promise((resolve, reject) => {
            app.listen(port, err => {
                if (err) { // Check for errors
                    reject(err); // Reject the promise if there is an error
                    return;
                }

                // Success
                console.log(`Web server listening on port ${port}`);
                resolve(); // Resolve the promise
            });
        });
    } catch (error) {
        console.error(`Error while starting the web server: ${error.message}`);
        throw error;
    }
};