import { startWebServer } from './src/web/server.js';

// Initialize the services
const initServices = async () => {
    try {
        await startWebServer(); // Start the web server
    } catch (error) {
        console.error('Error initializing services:', error.message);
    }
};

initServices(); // Initialize the services