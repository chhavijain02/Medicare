import express from 'express';
import { analyzeSymptoms, summarizeDoctorReviews } from '../Controllers/aiController.js';
import { matchDoctors } from '../Controllers/assistantController.js';

const router = express.Router();

// Public route for symptom analysis
router.post('/symptom-checker', analyzeSymptoms);

// Public route for AI review summarization
router.post('/doctor/:doctorId/summarize-reviews', summarizeDoctorReviews);

router.post('/match-doctors', matchDoctors);

export default router;
