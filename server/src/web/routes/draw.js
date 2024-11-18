import express from 'express';
import { loadLanguageData } from '../../utils/utils.js';
import { drawPairsAndSendMail } from '../../utils/draw.js';

const router = express.Router();

// Draw the pairs
router.post('/', async (req, res) => {
    try {
        const { lang, participants } = req.body; // Get language and participants from the request body
        const labels = await loadLanguageData(lang); // Load the language data
        const { message, messaggeList } = await drawPairsAndSendMail(participants, labels);
        res.json({ message: message, messaggeList: messaggeList }); // Send the response with the pairs
    } catch (error) {
        const errorMessage = error.isCustom ? error.message : labels['message.extraction.error'];
        const messages = error.isCustom ? error.messages : [];
        console.error(errorMessage, error);
        res.status(500).json({ message: errorMessage, messaggeList: messages || [] }); // Send the error response
    }
});

export default router;