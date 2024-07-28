// import React from "react";
// import { Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import patientAvatar from "../../assets/images/patient-avatar.png";
// import { HiStar } from "react-icons/hi";
// const Testimonial = () => {
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
//                   {[...Array(review?.rating).keys()].map((_,index) => (
//   <AiFillStar key={index} color="#feb60d" />
// ))}  
//                 </div>
//               </div>
//             </div>
//             <p className="text-[16px] leading-7 mt-4 text-textColor font-[400]">
//                {reviewText}
//             </p>
//           </div>
//         </SwiperSlide>
//       </Swiper>
//     </div>
//   );
// };

// export default Testimonial;



// import { BASE_URL } from "./../../config";
// import useFetchData from "./../../hooks/useFetchData";
// import Loader from "../../components/Loader/Loading";
// import Error from "../../components/Error/Error";
// import ReviewCard from "./ReviewCard";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import Slider from "react-slick";

// const Testimonial = () =>{
//     const {data:reviews, loading, error} = useFetchData(`${BASE_URL}/reviews`)
//     const SampleNextArrow = (props) => {
//       const { className, style, onClick } = props;
//       return (
//         <div
//           className={className}
//           style={{ ...style, display: "block", right: "10px", zIndex: 1,}}
//           onClick={onClick}
//         >
//           <IoIosArrowForward color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1 mr-3 mt-2 '/>
//         </div>
//       );
//     };
    
//     const SamplePrevArrow = (props) => {
//       const { className, style, onClick } = props;
//       return (
//         <div
//           className={className}
//           style={{ ...style, display: "block", right: "10px", zIndex: 1,}}
//           onClick={onClick}
//         >
//           <IoIosArrowBack color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1 ml-3 mt-2 '/>
//         </div>
//       );
//     };
//     const settings = {
//       infinite: true,
//       speed: 500,
//       slidesToShow: 3,
//       slidesToScroll: 1,
//       nextArrow: <SampleNextArrow />,
//       prevArrow: <SamplePrevArrow />,
//       responsive: [
//         {
//           breakpoint: 1024,
//           settings: {
//             slidesToShow: 2,
//             slidesToScroll: 1,
//           }
//         },
//         {
//           breakpoint: 600,
//           settings: {
//             slidesToShow: 1,
//             slidesToScroll: 1
//           }
//         }
//       ]
//     };
  
//     return (
//       <>
//     {loading && <Loader/>}
//     {error && <Error/>}

//        { !loading && !error && <div className="mt-[30px] lg:mt-[55px]">
//         <Slider {...settings}>
//             {reviews?.map((review,index)=>(
//             <ReviewCard key={review._id} review={review}/>
//             ))} 
//             </Slider>
//         </div>}
//     </>
//     );
// }

// export default Testimonial;


import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import ReviewCard from "./ReviewCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";
import { io } from 'socket.io-client';

const Testimonial = () => {
  const { data: reviews, loading, error, setData } = useFetchData(`${BASE_URL}/reviews/all`);
  console.log("Reviews:",reviews);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(BASE_URL);

    socket.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.current.on('new-review', (newReview) => {
      setData((prevReviews) => [newReview, ...prevReviews]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [BASE_URL, setData]);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "10px", zIndex: 1, }}
        onClick={onClick}
      >
        <IoIosArrowForward color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1 mr-3 mt-2 ' />
      </div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "10px", zIndex: 1, }}
        onClick={onClick}
      >
        <IoIosArrowBack color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1 ml-3 mt-2 ' />
      </div>
    );
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      {loading && <Loader />}
      {error && <Error />}
      {!loading && !error && (
        <div className="mt-[30px] lg:mt-[55px]">
          <Slider {...settings}>
            {reviews?.map((review, index) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </Slider>
        </div>
      )}
    </>
  );
}

export default Testimonial;
