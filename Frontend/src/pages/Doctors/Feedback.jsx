/* eslint-disable react/prop-types */
// This file is used to design Feedback Section in Doctor Detail's Page

// import { useState} from 'react'
// import { formateDate } from '../../utils/formateDate';
// import { AiFillStar} from 'react-icons/ai';
// import FeedbackForm from './FeedbackForm';

// const Feedback = ({reviews, totalRating}) => {
    // const [showFeedbackForm, setShowFeedbackForm] = useState(false);

//   return (
//     <div>
//        {/* ---------- Code for Sample Review ---------- */}
//       <div className='mb-[50px]'>
//         <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]'>
//             All reviews ({totalRating})
//         </h4>

        // { reviews?.map((review, index)=> 
        //     ( <div key={index} className='flex justify-between gap-10 mb-[30px]'>
        //         <div className="flex gap-3">
        //             <figure className="w-10 h-10 rounded-full">
        //                 <img src={review?.user?.photo} className='w-full' alt="" />
        //             </figure>
        
        //             <div>
        //                 <h5 className='text-[16px] leading-6 text-primaryColor font-bold'>{review?.user?.name}</h5>
        //                 <p className='text-[14px] leading-6 text-textColor'>{formateDate(review?.createdAt)}</p>
        //                 <p className='text__para mt-3 font-medium text-[15px]'>{review.reviewText}</p>
        //             </div>
        //         </div>
        
        //         <div className='flex gap-1'>
        //             {[...Array(review?.rating).keys()].map((_,index) => (
        //                 <AiFillStar key={index} color="#feb60d" />
        //             ))}
        //         </div>
        //      </div>
        //     )
        // )}
//       </div>
//     {/* ---------- Code for Sample Review ends ---------- */}


//     {/* ---------- Code for Give Feedback Button ---------- */}
//         {!showFeedbackForm && (
//          <div className='text-center'>
//             <button className='btn' onClick={()=> setShowFeedbackForm(true)}>Give Feedback</button>
//          </div>
//         )}
//         {showFeedbackForm && <FeedbackForm/>}

//     </div>
//   )
// }

// export default Feedback




import { useState, useEffect, useContext } from 'react';
import { formateDate } from '../../utils/formateDate';
import { AiFillStar } from 'react-icons/ai';
import FeedbackForm from './FeedbackForm';
import ReviewSummary from './ReviewSummary';
import { useSocket } from '../../context/SocketContext';
import { authContext } from '../../context/authContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const Feedback = ({ doctorId, onReviewsChange }) => {
  console.log("doctorId:", doctorId);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
  const socket = useSocket();
  const { user } = useContext(authContext);

    useEffect(() => {
      // Fetch all reviews for the specific doctor when the component mounts
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/v1/reviews/${doctorId}`);
          if (response.data.success) {
            console.log("Successfull fetching");
            console.log(response.data.data);
            setCurrentReviews(response.data.data);
            setTotalRating(response.data.data.length);
            if (onReviewsChange) onReviewsChange(response.data.data);

            // Check if current user has already reviewed
            if (user) {
              const existingUserReview = response.data.data.find(
                review => review.user._id === user._id
              );
              setUserReview(existingUserReview || null);
            }
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }, [doctorId, user]);

    useEffect(() => {
      if (!socket) return;

      const handleUpdate = ({doctorId: updatedId, reviews}) => {
        if (String(updatedId) !== String(doctorId)) return; // ignore other doctors
        setCurrentReviews(reviews);
        setTotalRating(reviews.length);
        if (onReviewsChange) onReviewsChange(reviews);

        // Update userReview after socket update
        if (user) {
          const existingUserReview = reviews.find(
            review => review.user._id === user._id
          );
          setUserReview(existingUserReview || null);
        }

        // Refresh AI summary to stay in sync with review changes
        setSummaryRefreshKey(prev => prev + 1);
      };

      socket.on('updateReviews', handleUpdate);
      return () => socket.off('updateReviews', handleUpdate);
    }, [socket, doctorId, user]);

    const handleDelete = async (reviewId) => {
      if (!window.confirm('Are you sure you want to delete your review?')) return;

      try {
        const currentToken = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/reviews/${doctorId}/${reviewId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message || 'Failed to delete review');
        }

        const result = await res.json();
        toast.success(result.message);
        setUserReview(null);
        setShowFeedbackForm(false);
      } catch (err) {
        toast.error(err.message);
        console.error('Error deleting review:', err);
      }
    };

    const handleEdit = (review) => {
      setEditingReview(review);
      setShowFeedbackForm(true);
    };

    const handleFormSuccess = () => {
      setShowFeedbackForm(false);
      setEditingReview(null);
    };

    return (
        <div>
          <div className='mb-[50px]'>
            <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]'>
              All reviews ({totalRating})
            </h4>

            {totalRating > 0 && (
              <ReviewSummary
                doctorId={doctorId}
                reviewsCount={totalRating}
                refreshTrigger={summaryRefreshKey}
              />
            )}

            {currentReviews && currentReviews.length > 0 ? (
                currentReviews.map((review, index) => (
                    <div key={index} className='flex justify-between gap-10 mb-[30px]'>
                      <div className="flex gap-3">
                        <figure className="w-10 h-10 rounded-full">
                          <img src={review?.user?.photo} className='w-full' alt=""/>
                        </figure>

                        <div>
                          <h5 className='text-[16px] leading-6 text-primaryColor font-bold'>{review?.user?.name}</h5>
                          <p className='text-[14px] leading-6 text-textColor'>{formateDate(review?.createdAt)}</p>
                          <p className='text__para mt-3 font-medium text-[15px]'>{review.reviewText}</p>
                        </div>
                      </div>

                      <div className='flex gap-1'>
                        {[...Array(review?.rating).keys()].map((_, index) => (
                            <AiFillStar key={index} color="#feb60d"/>
                        ))}
                        {[...Array(5 - review?.rating).keys()].map((_, index) => (
                            <AiFillStar key={index} color="#7B7D80"/>
                        ))}
                      </div>
                    </div>
                ))
            ) : (
                <p>No reviews yet!</p>
            )}
          </div>

          {/* Show edit/delete for user's own review, or "Give Feedback" button */}
          {user && userReview && !showFeedbackForm ? (
            <div className='text-center mb-4'>
              <p className='text-textColor mb-3'>You have already reviewed this doctor.</p>
              <button
                className='btn mr-3'
                onClick={() => handleEdit(userReview)}
              >
                Edit Review
              </button>
              <button
                className='btn bg-red-600 hover:bg-red-700'
                onClick={() => handleDelete(userReview._id)}
              >
                Delete Review
              </button>
            </div>
          ) : !showFeedbackForm && user ? (
            <div className='text-center'>
              <button className='btn' onClick={() => setShowFeedbackForm(true)}>Give Feedback</button>
            </div>
          ) : !user && !showFeedbackForm ? (
            <div className='text-center'>
              <p className='text-textColor'>Please log in to leave a review.</p>
            </div>
          ) : null}

          {showFeedbackForm && (
            <FeedbackForm
              doctorId={doctorId}
              existingReview={editingReview}
              onSubmitSuccess={handleFormSuccess}
            />
          )}
        </div>
    );
  };

export default Feedback;


