import { GoogleGenerativeAI } from '@google/generative-ai';
import Doctor from '../models/DoctorSchema.js';

export const LANGUAGES = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    gu: 'Gujarati',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
};

const getJsonModel = () => {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) throw new Error('No Gemini API key set');
    return new GoogleGenerativeAI(key).getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
        generationConfig: { responseMimeType: 'application/json' },
    });
};

const FAQ_FACTS = `
- Users sign up on the Register page and log in on the Login page. Doctors can register too, but a doctor appears in search only after being approved.
- To book: open Find a Doctor, choose a doctor, open their page and use the booking option, then pay securely through Stripe checkout. You must be logged in as a patient.
- Booked appointments are shown in the patient's profile (My Account).
- Patients can leave a star rating and a written review on a doctor's page.
- The price on a doctor's card is the consultation fee.
- There is currently no cancel or reschedule button on the website. For help, use the Contact page.
- The symptom checker gives general information only. It is not a diagnosis.
`;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const findDoctorsFromText = async (message, languageName) => {
    const specializations = (
        await Doctor.distinct('specialization', { isApproved: 'approved' })
    ).filter(Boolean);

    const prompt = `You are the assistant for "Medicare", a doctor appointment booking website.
Available specializations (use EXACTLY one of these, or null): ${JSON.stringify(specializations)}

Facts about the website (the ONLY facts you may use when answering questions about the site):
${FAQ_FACTS}

Patient message: """${message}"""

Return JSON only, in this shape:
{
  "intent": "find_doctor" or "faq" or "other",
  "specialization": string or null,
  "city": string or null,
  "maxPrice": number or null,
  "emergency": boolean,
  "noMatch": boolean,
  "reply": string
}
Rules:
- "intent" is "find_doctor" if the patient wants a doctor or describes a health need, "faq" if they ask how the website works, "other" for anything else.
- "specialization" must be one of the list above, or null if unclear.
- "city" and "maxPrice" only if the patient clearly mentioned them.
- "emergency" is true only for life-threatening situations (chest pain, trouble breathing, severe bleeding, stroke signs, etc).
- "noMatch" is true only when the patient clearly needs a kind of doctor that is NOT in the list above. In that case "reply" must say, in ${languageName}, that this specialty is not available right now, and name the specializations that are available.
- "reply" is 1-2 friendly sentences in ${languageName}.
  - find_doctor: say what you understood and that you are showing matching doctors. If emergency is true, tell them to call local emergency services right away. Do not diagnose.
  - faq: answer using only the facts above. If the facts do not cover it, say you are not sure and suggest the Contact page.
  - other: politely say you can help find doctors and answer questions about using Medicare.`;

    const result = await getJsonModel().generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    const matchedSpec =
        specializations.find(
            (s) => s.toLowerCase() === String(parsed.specialization || '').toLowerCase()
        ) || null;
    const city =
        typeof parsed.city === 'string' && parsed.city.trim() ? parsed.city.trim() : null;
    const maxPrice =
        typeof parsed.maxPrice === 'number' && parsed.maxPrice > 0 ? parsed.maxPrice : null;

    const filter = { isApproved: 'approved' };
    if (matchedSpec) filter.specialization = matchedSpec;
    if (city) filter['address.city'] = { $regex: escapeRegex(city), $options: 'i' };
    if (maxPrice) filter.ticketPrice = { $lte: maxPrice };

    const noMatch = parsed.noMatch === true && !matchedSpec;
    const wantsDoctors = parsed.intent !== 'faq' && parsed.intent !== 'other';
    const doctors = !wantsDoctors || noMatch ? [] : await Doctor.find(filter)
        .select('name photo specialization ticketPrice averageRating totalRating address')
        .sort({ averageRating: -1, totalRating: -1 })
        .limit(5)
        .lean();

    return {
        filters: { specialization: matchedSpec, city, maxPrice },
        emergency: parsed.emergency === true,
        noMatch,
        reply: String(parsed.reply || ''),
        doctors,
    };
};

export const matchDoctors = async (req, res) => {
    const { message, language = 'en' } = req.body || {};

    if (!message || typeof message !== 'string' || message.length > 500) {
        return res
            .status(400)
            .json({ success: false, message: 'Please send a message up to 500 characters' });
    }

    try {
        const data = await findDoctorsFromText(
            message.trim(),
            LANGUAGES[language] || 'English'
        );
        res.status(200).json({ success: true, ...data });
    } catch (err) {
        console.error('matchDoctors error:', err.message);
        res
            .status(500)
            .json({ success: false, message: 'Could not match doctors right now' });
    }
};