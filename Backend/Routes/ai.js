import express from 'express';
import { analyzeSymptoms, summarizeDoctorReviews } from '../Controllers/aiController.js';
import { matchDoctors } from '../Controllers/assistantController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
// Max 20 AI requests per minute per visitor, so the free Gemini quota can't be drained
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please wait a minute and try again.' },
});
router.use(aiLimiter);

// Public route for symptom analysis
router.post('/symptom-checker', analyzeSymptoms);

// Public route for AI review summarization
router.post('/doctor/:doctorId/summarize-reviews', summarizeDoctorReviews);

router.post('/match-doctors', matchDoctors);

export default router;
