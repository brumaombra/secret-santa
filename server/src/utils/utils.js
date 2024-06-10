import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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