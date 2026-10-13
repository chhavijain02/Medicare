import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import DoctorCard from '../../components/Doctors/DoctorCard';
import { LANGUAGES } from '../../utils/languages';
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlineAlert } from 'react-icons/ai';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      return toast.error('Please describe your symptoms');
    }

    if (symptoms.length > 2000) {
      return toast.error('Description is too long. Please keep it under 2000 characters.');
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch(`${BASE_URL}/ai/symptom-checker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to analyze symptoms');
      }

      setResults(data.data);
      toast.success('Analysis completed!');
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
      console.error('Error analyzing symptoms:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
            <AiOutlineAlert className="text-2xl" />
            <span className="font-semibold">Urgent - Seek immediate care</span>
          </div>
        );
      case 'urgent':
        return (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg">
            <AiOutlineWarning className="text-2xl" />
            <span className="font-semibold">Should see doctor soon</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
            <AiOutlineCheckCircle className="text-2xl" />
            <span className="font-semibold">Routine consultation</span>
          </div>
        );
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#fff9ea] py-[60px]">
        <div className="container">
          <div className="text-center max-w-[800px] mx-auto">
            <h1 className="text-[36px] md:text-[48px] leading-[46px] md:leading-[58px] font-[800] text-headingColor mb-4">
              AI Health Assistant & Doctor Finder
            </h1>
            <p className="text__para mb-6">
              Describe your symptoms and let our AI help you find the right specialist.
              Get personalized doctor recommendations instantly.
            </p>

            {/* Medical Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
              <p className="text-sm text-red-700">
                <strong>⚠️ Medical Disclaimer:</strong> This tool is for informational purposes only and does not constitute formal medical diagnosis or advice.
                <strong> If you are experiencing a medical emergency, please call your local emergency services immediately.</strong> Always consult with a qualified healthcare professional for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Symptom Input Form */}
      <section className="py-[60px]">
        <div className="container">
          <div className="max-w-[700px] mx-auto">
            <form onSubmit={handleAnalyze}>
              <div className="mb-5">
                <label className="text-headingColor font-semibold text-[16px] leading-7 mb-2 block">
                  Describe Your Symptoms *
                </label>
                <textarea
                  rows="6"
                  placeholder="E.g., I have been experiencing severe headaches with blurred vision and dizziness for the past 3 days..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-4 py-3 border border-solid border-[#0066ff34] focus:outline outline-primaryColor rounded-md"
                  maxLength={2000}
                />
                <p className="text-sm text-textColor mt-1">
                  {symptoms.length}/2000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-headingColor font-semibold text-[16px] leading-7 mb-2 block">
                    Age (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 border border-solid border-[#0066ff34] focus:outline outline-primaryColor rounded-md"
                  />
                </div>

                <div>
                  <label className="text-headingColor font-semibold text-[16px] leading-7 mb-2 block">
                    Gender (Optional)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-solid border-[#0066ff34] focus:outline outline-primaryColor rounded-md"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-headingColor font-semibold text-[16px] leading-7 mb-2 block">
                  Reply language
                </label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-solid border-[#0066ff34] focus:outline outline-primaryColor rounded-md"
                >
                  {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <HashLoader size={25} color="#fff" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Analyze Symptoms'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section className="pb-[60px]">
          <div className="container">
            <div className="max-w-[900px] mx-auto">
              {/* AI Assessment Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-[24px] font-bold text-headingColor mb-4">
                  AI Assessment
                </h2>

                <div className="mb-4">
                  {getUrgencyBadge(results.urgency)}
                </div>

                <p className="text__para mb-6">{results.analysis}</p>

                {/* Recommended Specializations */}
                <div className="mb-6">
                  <h3 className="text-[18px] font-semibold text-headingColor mb-3">
                    Recommended Specialists:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.recommendedSpecializations.map((spec, index) => (
                      <span
                        key={index}
                        className="bg-primaryColor text-white px-4 py-2 rounded-full text-[14px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Home Care Tips */}
                {results.homeCareTips && results.homeCareTips.length > 0 && (
                  <div>
                    <h3 className="text-[18px] font-semibold text-headingColor mb-3">
                      Self-Care Tips:
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {results.homeCareTips.map((tip, index) => (
                        <li key={index} className="text__para">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Matching Doctors */}
              <div>
                <h2 className="text-[28px] font-bold text-headingColor mb-6">
                  Recommended Doctors ({results.doctors.length})
                </h2>

                {results.doctors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {results.doctors.map((doctor) => (
                      <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text__para mb-4">
                      No doctors found matching the recommended specializations in our system.
                    </p>
                    <button
                      onClick={() => navigate('/doctors')}
                      className="btn"
                    >
                      View All Doctors
                    </button>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {results.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SymptomChecker;
