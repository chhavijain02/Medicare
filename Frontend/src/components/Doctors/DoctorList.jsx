
// import DoctorCard from './DoctorCard';

// import { BASE_URL } from "./../../config";
// import useFetchData from "./../../hooks/useFetchData";
// import Loader from "../../components/Loader/Loading";
// import Error from "../../components/Error/Error";

// const DoctorList = () =>{
    // const {data:doctors, loading, error} = useFetchData(`${BASE_URL}/doctors`)

    // return (
    // <>
    // {loading && <Loader/>}
    // {error && <Error/>}

    //    { !loading && !error && <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-
    //     [55px]'>
    //         {doctors.map(doctor=>(
    //         <DoctorCard key={doctor._id} doctor={doctor}/>
    //         ))} 
    //     </div>}
    // </>
    // )
// }

// export default DoctorList

import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DoctorCard from './DoctorCard';
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "20px" ,zIndex: 1,}}
      onClick={onClick}
    >
      <IoIosArrowForward color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1  '/>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "30px", zIndex: 1,}}
      onClick={onClick}
    >
      <IoIosArrowBack color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1  mr-3'/>
    </div>
  );
};

const DoctorList = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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

  const {data:doctors, loading, error} = useFetchData(`${BASE_URL}/doctors`)

  return (
  <>
  
  {loading && <Loader/>}
  {error && <Error/>}

     { !loading && !error && <div className='w-[100%] ml-5 mr-5 gap-5 lg:gap-[30px] mt-[30px] lg:mt-
      [55px]'>
        <Slider {...settings}>
          {doctors.map(doctor=>(
          <DoctorCard key={doctor._id} doctor={doctor}/>
          ))} 
          </Slider>
      </div>}
  </>
  )
};

export default DoctorList;