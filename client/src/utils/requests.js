import axios from 'axios';
import { CustomError, getTranslation } from './utils.js';

const devUrl = process.env.NODE_ENV === 'production' ? 'https://santa.bruma.cloud' : 'http://localhost:3001';

// Axios instance
const api = axios.create({
    baseURL: devUrl,
    timeout: 10000
});

// Draw the pairs
export const drawPairs = async (participants, lang) => {
    try {
        const { data } = await api.post(`/api/draw`, { participants, lang });
        return data;
    } catch (error) {
        const customError = new CustomError(error.response?.data?.message || getTranslation('message.error.extraction'));
        customError.messages = error.response?.data?.messaggeList || [];
        throw customError;
    }
};