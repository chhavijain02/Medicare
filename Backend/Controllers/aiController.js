import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import Doctor from '../models/DoctorSchema.js';
import Review from '../models/ReviewSchema.js';
import { createHash } from 'crypto';

// Available specializations in the system
const AVAILABLE_SPECIALIZATIONS = [
  "Cardiologist", "Surgeon", "Dermatologist", "Gynecologist", "Psychiatrist",
  "Neurologist", "Pediatrics", "Physician", "Dentist", "Hematologist", "Nephrologist", "Orthopedician"
];

// Helper to reliably extract and parse JSON from AI responses (handles markdown fences, preamble)
const cleanJson = (text) => {
  if (!text) throw new Error('Empty AI response');
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
};

// Initialize Google Gemini client with automatic model fallback
const getGeminiModel = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-flash-latest"];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      // Try to generate with this model
      const result = await model.generateContent(prompt);
      console.log(`✅ Using Gemini model: ${modelName}`);
      return result.response.text();
    } catch (error) {
      console.log(`⚠️ ${modelName} failed (${error.message.substring(0, 50)}), trying next...`);
      continue;
    }
  }

  // All Gemini models failed
  return null;
};

// Anthropic Claude fallback if ANTHROPIC_API_KEY is configured
const getAnthropicModel = async (prompt) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });
    const text = response.content?.[0]?.text;
    if (text) {
      console.log('✅ Using Anthropic Claude model');
      return text;
    }
  } catch (error) {
    console.log(`⚠️ Anthropic failed (${error.message.substring(0, 50)})`);
  }

  return null;
};

// Unified AI generator: tries Gemini first, then Anthropic
const getAIResponse = async (prompt) => {
  const geminiRes = await getGeminiModel(prompt);
  if (geminiRes) return geminiRes;

  const anthropicRes = await getAnthropicModel(prompt);
  if (anthropicRes) return anthropicRes;

  return null;
};

// Fallback: rule-based symptom analysis when API key is not available
const fallbackAnalysis = (symptoms, age, gender) => {
  const symptomsLower = symptoms.toLowerCase();
  let recommendedSpecializations = [];
  let urgency = "routine";
  let homeCareTips = [];

  // Gynecological symptoms (check first with broad stem matching)
  if (symptomsLower.match(/pregnan|period|menstru|uter|ovar|pelvi|vagin|cervic|pcos|pcod|endometr|fertilit|conceiv|cramp/i)) {
    recommendedSpecializations.push("Gynecologist");
    if (symptomsLower.match(/pain|bleed|severe|sharp/i)) {
      urgency = "urgent";
    }
    homeCareTips.push("Rest and avoid strenuous activity", "Track dates and symptoms", "Take an OTC pregnancy test if applicable");
  }

  // Cardiac symptoms
  if (symptomsLower.match(/chest pain|heart|shortness of breath|palpitation/i)) {
    recommendedSpecializations.push("Cardiologist");
    urgency = "urgent";
    homeCareTips.push("Avoid strenuous activity", "Rest and monitor symptoms");
  }

  // Dermatological symptoms
  if (symptomsLower.match(/skin|rash|acne|eczema|itching|mole/i)) {
    recommendedSpecializations.push("Dermatologist");
    homeCareTips.push("Keep affected area clean and dry", "Avoid scratching");
  }

  // Neurological symptoms
  if (symptomsLower.match(/headache|migraine|seizure|numbness|dizziness|tremor/i)) {
    recommendedSpecializations.push("Neurologist");
    homeCareTips.push("Rest in a quiet, dark room", "Stay hydrated");
  }

  // Psychiatric symptoms
  if (symptomsLower.match(/anxiety|anxious|depression|depressed|stress|panic|sleep disorder|mood swing|mental|suicidal|sad|worry|fear|ocd|adhd|bipolar/i)) {
    recommendedSpecializations.push("Psychiatrist");
    if (symptomsLower.match(/suicid|harm|hurt myself/i)) {
      urgency = "emergency";
      homeCareTips.push("Call a crisis helpline immediately", "Reach out to someone you trust");
    } else {
      homeCareTips.push("Practice deep breathing", "Maintain regular sleep schedule", "Consider journaling your thoughts");
    }
  }

  // Gastrointestinal symptoms (only if not already matched gynecological)
  if (symptomsLower.match(/stomach|abdominal|nausea|vomiting|diarrhea|digestion/i) && recommendedSpecializations.length === 0) {
    recommendedSpecializations.push("Physician");
    homeCareTips.push("Stay hydrated", "Eat bland foods");
  }

  // Dental symptoms
  if (symptomsLower.match(/tooth|dental|gum|jaw pain/i)) {
    recommendedSpecializations.push("Dentist");
    homeCareTips.push("Maintain oral hygiene", "Avoid hard foods");
  }

  // Blood-related symptoms
  if (symptomsLower.match(/blood disorder|anemia|clotting|bruising easily|bleeding/i)) {
    recommendedSpecializations.push("Hematologist");
    homeCareTips.push("Monitor symptoms closely");
  }

  // Kidney/urinary symptoms
  if (symptomsLower.match(/kidney|urine|bladder|urinary/i)) {
    recommendedSpecializations.push("Nephrologist");
    homeCareTips.push("Stay well hydrated", "Monitor urine output");
  }

  // Age-based defaults
  if (age && age < 18 && recommendedSpecializations.length === 0) {
    recommendedSpecializations.push("Pediatrics");
  }

  // Default to Physician if no specific match
  if (recommendedSpecializations.length === 0) {
    recommendedSpecializations.push("Physician");
  }

  // Remove duplicates
  recommendedSpecializations = [...new Set(recommendedSpecializations)];

  return {
    recommendedSpecializations,
    analysis: `Based on your symptoms, we recommend consulting with ${recommendedSpecializations.join(' or ')}. This is a preliminary suggestion - please consult a healthcare professional for proper diagnosis.`,
    urgency,
    homeCareTips: homeCareTips.length > 0 ? homeCareTips : ["Rest and monitor your symptoms", "Stay hydrated", "Seek medical attention if symptoms worsen"]
  };
};

// Main symptom analysis controller
export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    // Validation
    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description of your symptoms'
      });
    }

    if (symptoms.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Symptom description is too long. Please keep it under 2000 characters.'
      });
    }

    let analysisResult;

    // Try to use Google Gemini API with automatic model fallback
    const prompt = `You are an expert medical triage assistant. Analyze the patient's symptoms and recommend the most suitable medical specialists.

RULES:
1. Recommend up to 3 medical specializations chosen ONLY from this exact list: ${AVAILABLE_SPECIALIZATIONS.join(', ')}.
2. Provide a supportive, clear 2-3 sentence analysis of what might be happening.
3. Assess urgency as one of: "routine" (standard visit), "urgent" (see doctor within 24-48 hours), or "emergency" (seek immediate emergency care).
4. Suggest 2-4 safe, helpful self-care tips.

Patient Information:
- Symptoms: "${symptoms}"
${age ? `- Age: ${age}` : ''}
${gender ? `- Gender: ${gender}` : ''}

You MUST return valid JSON in this exact structure:
{
  "recommendedSpecializations": ["Specialization1", "Specialization2"],
  "analysis": "Clear explanation here",
  "urgency": "routine",
  "homeCareTips": ["Tip 1", "Tip 2"]
}`;

    const aiResponse = await getAIResponse(prompt);

    if (aiResponse) {
      try {
        analysisResult = cleanJson(aiResponse);

        // Filter to only recognized specializations
        analysisResult.recommendedSpecializations = (analysisResult.recommendedSpecializations || []).filter(
          spec => AVAILABLE_SPECIALIZATIONS.includes(spec)
        );

        if (analysisResult.recommendedSpecializations.length === 0) {
          analysisResult.recommendedSpecializations = ["Physician"];
        }

        console.log("✅ AI symptom analysis completed:", analysisResult.recommendedSpecializations);

      } catch (parseError) {
        console.error('AI returned invalid JSON, falling back to rule-based:', parseError.message);
        analysisResult = fallbackAnalysis(symptoms, age, gender);
      }
    } else {
      console.log('AI models unavailable, using rule-based fallback analysis');
      analysisResult = fallbackAnalysis(symptoms, age, gender);
    }

    // Query doctors matching the recommended specializations
    const doctors = await Doctor.find({
      isApproved: "approved",
      specialization: { $in: analysisResult.recommendedSpecializations }
    })
      .select("-password")
      .sort({ averageRating: -1 })
      .limit(20);

    // Return response
    res.status(200).json({
      success: true,
      message: "Symptom analysis completed",
      data: {
        analysis: analysisResult.analysis,
        urgency: analysisResult.urgency,
        recommendedSpecializations: analysisResult.recommendedSpecializations,
        homeCareTips: analysisResult.homeCareTips,
        doctors,
        disclaimer: "This tool is for informational purposes only and does not constitute formal medical diagnosis or advice. If you are experiencing a medical emergency, please call your local emergency services immediately. Always consult with a qualified healthcare professional for proper diagnosis and treatment."
      }
    });

  } catch (err) {
    console.error('Error in analyzeSymptoms:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze symptoms. Please try again.'
    });
  }
};

// Fallback: rule-based review synthesis when AI models are unavailable
const fallbackSummary = (reviews) => {
  const total = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total;
  const positiveCount = reviews.filter(r => (r.rating || 0) >= 4).length;
  const negativeCount = reviews.filter(r => (r.rating || 0) <= 2).length;
  const positivePct = Math.round((positiveCount / total) * 100);

  let overallSentiment;
  if (positivePct >= 85) overallSentiment = "Overwhelmingly Positive";
  else if (positivePct >= 60) overallSentiment = "Mostly Positive";
  else if (positivePct >= 40) overallSentiment = "Mixed";
  else overallSentiment = "Needs Improvement";

  const positiveReviews = reviews.filter(r => (r.rating || 0) >= 4 && r.reviewText?.trim());
  const criticalReviews = reviews.filter(r => (r.rating || 0) <= 2 && r.reviewText?.trim());

  const pros = [];
  if (positiveReviews.length > 0) {
    const sample = positiveReviews[0].reviewText.trim();
    pros.push(sample.length > 90 ? sample.substring(0, 90) + '...' : sample);
    pros.push(`High patient satisfaction with ${positivePct}% giving 4+ stars`);
  } else {
    pros.push(`Patients rated this doctor an average of ${avgRating.toFixed(1)}/5 stars`);
  }

  const cons = [];
  if (criticalReviews.length > 0) {
    const sample = criticalReviews[0].reviewText.trim();
    cons.push(sample.length > 90 ? sample.substring(0, 90) + '...' : sample);
  } else if (negativeCount > 0) {
    cons.push(`${negativeCount} patient${negativeCount > 1 ? 's' : ''} reported a below-average experience`);
  } else {
    cons.push("No significant concerns reported");
  }

  return {
    overallSentiment,
    sentimentScore: positivePct,
    summary: `Based on ${total} patient review${total > 1 ? 's' : ''}, this doctor holds an average rating of ${avgRating.toFixed(1)}/5 stars, with ${positivePct}% of patients reporting a positive experience.`,
    pros,
    cons
  };
};

// Remembers the last AI summary per doctor (cleared when the server restarts)
const summaryCache = new Map();

// Summarize all reviews for a given doctor
export const summarizeDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      });
    }

    const reviews = await Review.find({ doctor: doctorId })
      .select('rating reviewText createdAt')
      .lean();

    if (reviews.length < 2) {
      return res.status(200).json({
        success: true,
        message: 'Not enough reviews to summarize',
        data: {
          canSummarize: false,
          count: reviews.length,
          message: `At least 2 reviews are needed to generate an AI summary. This doctor currently has ${reviews.length}.`
        }
      });
    }

    const reviewsForPrompt = reviews
      .map((r, i) => `Review ${i + 1} (Rating: ${r.rating}/5): "${(r.reviewText || '').trim()}"`)
      .join('\n');

    // Same reviews => same fingerprint => reuse the saved summary
    const fingerprint = createHash('sha1').update(reviewsForPrompt).digest('hex');
    const cached = summaryCache.get(String(doctorId));
    if (cached && cached.fingerprint === fingerprint) {
      console.log('Using cached review summary for doctor:', doctorId);
      return res.status(200).json(cached.payload);
    }

    const prompt = `You are a healthcare review analyst. Read these patient reviews for a doctor and produce a fair, balanced summary that helps prospective patients decide.

RULES:
1. Be neutral and factual - do not exaggerate praise or criticism.
2. Base every pro and con strictly on what the reviews actually say.
3. Keep the summary to 2-3 sentences.
4. Provide 2-4 pros and 1-3 cons (cons can be empty if none are mentioned).
5. sentimentScore must be an integer 0-100 representing the overall positivity.
6. overallSentiment must be exactly one of: "Overwhelmingly Positive", "Mostly Positive", "Mixed", "Needs Improvement".

PATIENT REVIEWS:
${reviewsForPrompt}

You MUST return valid JSON in this exact structure:
{
  "overallSentiment": "Mostly Positive",
  "sentimentScore": 80,
  "summary": "2-3 sentence overview here",
  "pros": ["Strength one", "Strength two"],
  "cons": ["Concern one"]
}`;

    let summaryResult;
    let usedAI = false;
    const aiResponse = await getAIResponse(prompt);

    if (aiResponse) {
      try {
        summaryResult = cleanJson(aiResponse);

        // Sanitize the AI output
        summaryResult.overallSentiment = ["Overwhelmingly Positive", "Mostly Positive", "Mixed", "Needs Improvement"].includes(summaryResult.overallSentiment)
          ? summaryResult.overallSentiment
          : "Mixed";
        summaryResult.sentimentScore = Math.min(100, Math.max(0, parseInt(summaryResult.sentimentScore) || 50));
        summaryResult.summary = String(summaryResult.summary || '').trim();
        summaryResult.pros = Array.isArray(summaryResult.pros) ? summaryResult.pros.slice(0, 5) : [];
        summaryResult.cons = Array.isArray(summaryResult.cons) ? summaryResult.cons.slice(0, 3) : [];

        if (!summaryResult.summary) {
          throw new Error('Empty summary returned');
        }

        console.log('✅ AI review summary completed for doctor:', doctorId);
        usedAI = true;
      } catch (parseError) {
        console.error('AI returned invalid summary JSON, falling back to rule-based:', parseError.message);
        summaryResult = fallbackSummary(reviews);
      }
    } else {
      console.log('AI models unavailable, using rule-based review summary');
      summaryResult = fallbackSummary(reviews);
    }

    const payload = {
      success: true,
      message: 'Review summary generated',
      data: {
        canSummarize: true,
        count: reviews.length,
        ...summaryResult
      }
    };

    // Only remember real AI summaries, so the AI is retried if it failed this time
    if (usedAI) {
      summaryCache.set(String(doctorId), { fingerprint, payload });
    }

    res.status(200).json(payload);

  } catch (err) {
    console.error('Error in summarizeDoctorReviews:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate review summary. Please try again.'
    });
  }
};
