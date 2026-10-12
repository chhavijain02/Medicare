
import { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { useSocket } from "../../context/SocketContext";

const FeedbackForm = ({ existingReview = null, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { id: doctorId } = useParams();

  // Update form when existingReview changes (edit mode)
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.reviewText);
    } else {
      // Reset form for new review
      setRating(0);
      setReviewText("");
    }
  }, [existingReview]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!rating || !reviewText) {
        setLoading(false);
        return toast.error("Rating & Review Fields are required");
      }

      const currentToken = localStorage.getItem("token");
      const isEditMode = existingReview !== null;
      const url = isEditMode
        ? `${BASE_URL}/reviews/${doctorId}/${existingReview._id}`
        : `${BASE_URL}/reviews/${doctorId}`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ rating, reviewText }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to submit review");
      }

      const result = await res.json();
      console.log("Review submission result:", result);

      // Clear form after successful submission (only for new reviews)
      if (!isEditMode) {
        setRating(0);
        setHover(0);
        setReviewText("");
      }

      setLoading(false);
      toast.success(result.message);

      // Notify parent to refresh or close form
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
      console.error("Error submitting review:", err);
    }
  };
  return (
    <form action="">
      {/* ---------- Star Rating --------- */}
      <div>
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          How would you rate the overall experience?*
        </h3>

        <div>
          {[...Array(5).keys()].map((_, index) => {
            index += 1;

            return (
              <button
                key={index}
                type="button"
                className={`${
                  index <= (hover || rating)
                    ? "text-yellowColor"
                    : "text-gray-400"
                }
                            bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(0)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* ---------- Star Rating Code ends --------- */}

      {/* ---------- text feedback--------------- */}
      <div className="mt-[30px]">
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          Share your feedback or suggestions.*
        </h3>
        <textarea
          className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md"
          rows="5"
          placeholder="Write your message!"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>

        <button type="submit" onClick={handleSubmitReview} className="btn">
          {loading ? <HashLoader size={25} color="#fff" /> : existingReview ? "Update Feedback" : "Submit Feedback"}
        </button>
        {existingReview && (
          <button
            type="button"
            onClick={() => onSubmitSuccess && onSubmitSuccess()}
            className="ml-3 bg-gray-500 text-white py-2 px-5 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
      {/* ---------- text feedback Code ends--------------- */}
    </form>
  );
};

export default FeedbackForm;


