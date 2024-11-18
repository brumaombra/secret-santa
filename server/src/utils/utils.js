import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import validator from 'validator';

// Custom error class
export class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomError";
        this.isCustom = true;
        this.messages = [];
    }
}

// Load a file
export const loadFile = async filePath => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fullPath = path.join(__dirname, filePath); // Complete path
    return await fsPromises.readFile(fullPath); // Load file
};

// Load the language data
export const loadLanguageData = async selectedLang => {
    try {
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

// Validate the input data
export const validateData = (participants, labels) => {
    if (!participants || !Array.isArray(participants)) throw new CustomError(labels['message.required.fields']); // Invalid data
    if (participants.length < 3) throw new CustomError(labels['message.minimum.participants']); // At least 3
    participants.forEach(participant => { // Validate each participant
        if (!participant || !validator.isEmail(participant.email)) throw new CustomError(labels['message.invalid.email'].replace('{0}', participant.email)); // Email not valid
    });
};