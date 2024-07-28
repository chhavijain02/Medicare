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




import { useState, useEffect } from 'react';
import { formateDate } from '../../utils/formateDate';
import { AiFillStar } from 'react-icons/ai';
import FeedbackForm from './FeedbackForm';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

const Feedback = ({ doctorId }) => {
    console.log("doctorId:",doctorId);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    // Fetch all reviews for the specific doctor when the component mounts
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/reviews/${doctorId}`);
        if (response.data.success) {
            console.log("Successfull fetching");
            console.log(response.data.data);
          setCurrentReviews(response.data.data);
          setTotalRating(response.data.data.length);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [doctorId]);

  useEffect(() => {
    if (socket) {
      socket.on('updateReviews', (updatedReviews) => {
        setCurrentReviews(updatedReviews);
        setTotalRating(updatedReviews.length);
      });
    }

    return () => {
      if (socket) {
        socket.off('updateReviews');
      }
    };
  }, [socket]);

  return (
    <div>
      <div className='mb-[50px]'>
        <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]'>
          All reviews ({totalRating})
        </h4>

        {currentReviews && currentReviews.length > 0 ? (
          currentReviews.map((review, index) => (
            <div key={index} className='flex justify-between gap-10 mb-[30px]'>
              <div className="flex gap-3">
                <figure className="w-10 h-10 rounded-full">
                  <img src={review?.user?.photo} className='w-full' alt="" />
                </figure>

                <div>
                  <h5 className='text-[16px] leading-6 text-primaryColor font-bold'>{review?.user?.name}</h5>
                  <p className='text-[14px] leading-6 text-textColor'>{formateDate(review?.createdAt)}</p>
                  <p className='text__para mt-3 font-medium text-[15px]'>{review.reviewText}</p>
                </div>
              </div>

              <div className='flex gap-1'>
                {[...Array(review?.rating).keys()].map((_, index) => (
                  <AiFillStar key={index} color="#feb60d" />
                ))}
                {[...Array(5-review?.rating).keys()].map((_, index) => (
              <AiFillStar key={index} color="#7B7D80" />
            ))}
              </div>
            </div>
          ))
        ) : (
             <p>No reviews yet!</p>
            )}
      </div>

      {!showFeedbackForm && (
        <div className='text-center'>
          <button className='btn' onClick={() => setShowFeedbackForm(true)}>Give Feedback</button>
        </div>
      )}
      {showFeedbackForm && <FeedbackForm doctorId={doctorId} />}
    </div>
  );
};

export default Feedback;


