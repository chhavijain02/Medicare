// import { services } from "../../assets/data/services.js";
// import ServiceCard from "./ServiceCard.jsx";
// const ServiceList = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
//       {services.map((item, index) => (
//         <ServiceCard item={item} key={index} />
//       ))}
//     </div>
//   );
// };

// export default ServiceList;



import React from 'react';
import Slider from "react-slick";
import { services } from "../../assets/data/services.js";
import ServiceCard from "./ServiceCard.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1,}}
      onClick={onClick}
    >
      <IoIosArrowForward color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1 mr-3 mt-2 '/>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1,}}
      onClick={onClick}
    >
      <IoIosArrowBack color="white" size="30px" className='bg-[#B0B0B0] rounded-[50%] p-1 ml-3 mt-2 '/>
    </div>
  );
};

const ServiceList = () => {
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
    <div className="mt-[30px] lg:mt-[55px] ml-[10px]">
      <Slider {...settings}>
        {services.map((item, index) => (
          <ServiceCard item={item} key={index} index={index} />
        ))}
      </Slider>
    </div>
  );
};

export default ServiceList;
