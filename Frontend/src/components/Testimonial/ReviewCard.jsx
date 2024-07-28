// import React from "react";
// import { Link } from "react-router-dom";
// import starIcon from "../../assets/images/Star.png";
// import { BsArrowRight } from "react-icons/bs";
// import { Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { AiFillStar } from "react-icons/ai";

// const ReviewCard = ({ review, index }) => {
//   const { reviewText } = review;
//   return (
//     <div className="mt-[30px] lg:mt-[55px]">
//       <Swiper
//         modules={[Pagination]}
//         spaceBetween={30}
//         slidesPerView={1}
//         pagination={{ clickable: true }}
//         breakpoints={{
//           640: {
//             slidesPerView: 1,
//             spaceBetween: 10,
//           },
//           768: {
//             slidesPerView: 2,
//             spaceBetween: 20,
//           },
//           1024: {
//             slidesPerView: 3,
//             spaceBetween: 30,
//           },
//         }}
//       >
//         <SwiperSlide>
//           <div className="py-[30px] px-5 rounded-3">
//             <div className="flex items-center gap-[13px]">
//               <img src={review?.user?.photo} alt="" />
//               <div>
//                 <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
//                   {review?.user?.name}
//                 </h4>
//                 <div className="flex items-center gap-[2px]">
//                   {[...Array(review?.rating).keys()].map((_, index) => (
//                     <AiFillStar key={index} color="#feb60d" />
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <p className="text-[16px] leading-7 mt-4 text-textColor font-[400]">
//               {reviewText}
//             </p>
//           </div>
//         </SwiperSlide>
//       </Swiper>
//     </div>
//   );
// };

// export default ReviewCard;

import React, { useState, useRef, useEffect } from 'react';
import { AiFillStar} from "react-icons/ai";

const ReviewCard = ({ review }) => {
  console.log("review:",review);
  const { reviewText } = review;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [reviewText]);
  const yellowStars = review?.rating || 0;
  const greyStars = 5 - yellowStars;
  return (
    <div className={`py-[20px] px-[10px] ml-10 border rounded-xl transition-all duration-300 lg:w-[80%] pl-8 bg-gradient-to-r from-[#F0F2FA] to-[#BBD2FF] ${isExpanded ? 'h-auto' : 'h-[180px] overflow-hidden'}`}>
      <div className="flex items-center gap-[20px]">
        <img
          src={review?.user?.photo}
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
            {review?.user?.name}
          </h4>
          <div className="flex items-center gap-[2px]">
          {[...Array(yellowStars).keys()].map((_, index) => (
              <AiFillStar key={index} color="#feb60d" />
            ))}
            {[...Array(greyStars).keys()].map((_, index) => (
              <AiFillStar key={index} color="#7B7D80" />
            ))}
          </div>
        </div>
      </div>
      <p
        ref={textRef}
        className={`text-[16px] leading-7 mt-4 text-textColor font-[400] break-words transition-all duration-300 ${isExpanded ? '' : 'max-h-[3.5rem] overflow-hidden'}`}
      >
        {reviewText}
      </p>
      {isOverflowing && !isExpanded && (
        <button onClick={toggleExpand} className="text-blue-500 mt-2">Read more</button>
      )}
      {isExpanded && (
        <button onClick={toggleExpand} className="text-blue-500 mt-2">Read less</button>
      )}
    </div>
  );
};

export default ReviewCard;
