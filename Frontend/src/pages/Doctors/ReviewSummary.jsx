import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';
import { AiFillCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { FiRefreshCw } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

const sentimentStyles = {
  "Overwhelmingly Positive": "bg-green-100 text-green-700",
  "Mostly Positive": "bg-green-100 text-green-600",
  "Mixed": "bg-yellow-100 text-yellow-700",
  "Needs Improvement": "bg-red-100 text-red-600",
};

const ReviewSummary = ({ doctorId, reviewsCount, refreshTrigger }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/ai/doctor/${doctorId}/summarize-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Could not generate summary');
      }

      if (result.data.canSummarize) {
        setSummary(result.data);
      } else {
        // Below threshold -> don't render the card
        setHidden(true);
      }
    } catch (err) {
      console.error('Review summary error:', err.message);
      setHidden(true); // AI summary is a nice-to-have; hide silently on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHidden(false);
    setSummary(null);
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, refreshTrigger]);

  if (hidden) return null;

  return (
    <div className="mt-[30px] rounded-[10px] border border-solid border-[#e6f5f7] bg-[#f7fdfe] p-5 md:p-6">
      {loading || !summary ? (
        // Loading skeleton
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <BsStars className="text-irisBlueColor w-5 h-5" />
            <div className="h-5 w-40 bg-[#ccf0f3] rounded"></div>
          </div>
          <div className="h-4 bg-[#ccf0f3] rounded w-full mb-2"></div>
          <div className="h-4 bg-[#ccf0f3] rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-[#ccf0f3] rounded w-2/3"></div>
          <p className="text-[13px] text-textColor mt-3">AI is reading {reviewsCount} reviews...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <BsStars className="text-irisBlueColor w-5 h-5" />
              <h4 className="text-[18px] leading-6 font-[700] text-headingColor">
                AI Review Insights
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[12px] font-[600] ${
                  sentimentStyles[summary.overallSentiment] || sentimentStyles["Mixed"]
                }`}
              >
                {summary.sentimentScore}% {summary.overallSentiment}
              </span>
              <button
                onClick={fetchSummary}
                title="Regenerate summary"
                className="p-2 rounded-full hover:bg-[#ccf0f3] transition-colors"
              >
                <FiRefreshCw className="w-4 h-4 text-irisBlueColor" />
              </button>
            </div>
          </div>

          {/* Summary text */}
          <p className="text__para font-[500] leading-7">{summary.summary}</p>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div className="bg-green-50 rounded-[8px] p-4">
              <h5 className="text-[14px] font-[700] text-green-700 mb-3">
                What Patients Love
              </h5>
              <ul className="space-y-2">
                {summary.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-[14px] leading-6 text-textColor">
                    <AiFillCheckCircle className="text-green-600 w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 rounded-[8px] p-4">
              <h5 className="text-[14px] font-[700] text-amber-700 mb-3">
                Points to Keep in Mind
              </h5>
              <ul className="space-y-2">
                {summary.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-[14px] leading-6 text-textColor">
                    <AiOutlineInfoCircle className="text-amber-600 w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-gray-400 mt-4">
            ✨ Generated by AI from {summary.count} patient review{summary.count > 1 ? 's' : ''}. Individual experiences may vary.
          </p>
        </>
      )}
    </div>
  );
};

export default ReviewSummary;
