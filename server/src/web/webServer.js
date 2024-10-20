import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import validator from 'validator';
import { CustomError, loadFile } from '../utils/utils.js';
import { drawPairs } from '../utils/draw.js';
import { sendEmails } from '../email/email.js';

// Load the environment variables
dotenv.config(); // Load the .env file
if (!process.env.TEST_ENV) console.error('Error while loading the environment variables');

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// Serve the static folders
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../public/app'))); // The web app
app.use('/assets', express.static(path.join(__dirname, '../../public/assets'))); // The assets for the email

// Validate the input data
const validateData = (participants, labels) => {
    if (!participants || !Array.isArray(participants)) throw new CustomError(labels['message.required.fields']); // Invalid data
    if (participants.length < 3) throw new CustomError(labels['message.minimum.participants']); // At least 3
    participants.forEach(participant => { // Validate each participant
        if (!participant || !validator.isEmail(participant.email)) throw new CustomError(labels['message.invalid.email'].replace('{0}', participant.email)); // Email not valid
    });
};

// Load the language data
const loadLanguageData = async selectedLang => {
    try { // Import the language data
        const availableLanguages = ['en', 'it', 'de', 'es', 'fr'];
        const lang = availableLanguages.includes(selectedLang) ? selectedLang : 'en';
        const fileBuffer = await loadFile(`../lang/${lang}.json`); // Load the labels data from the file
        const fileContent = fileBuffer.toString('utf-8'); // Convert byte array to string
        const labels = JSON.parse(fileContent); // Parse string to JSON
        return labels;
    } catch (error) {
        const errorMessage = 'Error loading the language data';
        console.error(errorMessage, error); // Log the error
        throw new Error(errorMessage);
    }
};

// Draw the pairs
const drawThePairs = async (participants, labels) => {
    try {
        validateData(participants, labels); // Validate the data
        const pairs = drawPairs(participants, labels); // Attempt to draw pairs
        const messages = await sendEmails(pairs, labels); // Send the emails
        return { message: labels['message.extraction.success'], messaggeList: messages };
    } catch (error) {
        throw error.isCustom ? error : new CustomError(labels['message.extraction.error']);
    }
};

// Draw the pairs
app.post('/api/draw', async (req, res) => {
    const { lang, participants } = req.body; // Get language and participants from the request body
    try {
        const labels = await loadLanguageData(lang); // Load the language data
        const { message, messaggeList } = await drawThePairs(participants, labels);
        res.json({ message: message, messaggeList: messaggeList }); // Send the response with the pairs
    } catch (error) {
        const errorMessage = error.isCustom ? error.message : labels['message.extraction.error'];
        const messages = error.isCustom ? error.messages : [];
        console.error(errorMessage, error);
        res.status(500).json({ message: errorMessage, messaggeList: messages || [] }); // Send the error response
    }
});

// Middleware for handling exceptions and errors globally
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ message: 'Internal Server Error' });
});

// Every other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/app', 'index.html'));
});

// Initialize the web server
export const initWebServer = () => {
    try {
        app.listen(port, () => { // Start the server
            console.log(`Web server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error while starting the web server');
    }
};