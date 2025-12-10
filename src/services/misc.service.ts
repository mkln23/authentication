import Tesseract from 'tesseract.js';

import { ApiError } from '@/utils/apiError';
import { extractAmounts } from '@/utils/extractText';

export class MiscellaneousService {
    static async extractTextUsingOCR() {
        try {
            const {
                data: { text },
            } = await Tesseract.recognize('ebill-1.jpeg', 'eng');
            console.log(typeof text);
            const mappedAmount = extractAmounts(text);
            console.log(mappedAmount);
            return text;
        } catch (error) {
            console.log(error);
            throw new ApiError(error as string);
        }
    }
}
