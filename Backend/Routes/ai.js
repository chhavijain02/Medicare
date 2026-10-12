import express from 'express';
import { analyzeSymptoms, summarizeDoctorReviews } from '../Controllers/aiController.js';

const router = express.Router();

// Public route for symptom analysis
router.post('/symptom-checker', analyzeSymptoms);

// Public route for AI review summarization
router.post('/doctor/:doctorId/summarize-reviews', summarizeDoctorReviews);

export default router;
