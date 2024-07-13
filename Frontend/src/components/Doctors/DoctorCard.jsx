/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import starIcon from "../../assets/images/Star.png";
import { BsArrowRight } from "react-icons/bs";
// eslint-disable-next-line react/prop-types
const DoctorCard = ({ doctor }) => {
  const {
    id,
    name,
    specialization,
    avgRating,
    totalRating,
    photo,
    totalPatients,
    hospital,
  } = doctor;
  return (
    <div className="ml-2 mr-2 pl-2 pr-2 w-[250px] h-[420px]">
      <div>
        <img src={photo} alt="" className="w-full" />
      </div>
      <h2 className="text-[18px] lg:text-[26px] font-[700] leading-[30px] lg:leading-9 text-headingColor mt-3 lg:mt-5">
        {name}
      </h2>

      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span className="bg-buttonColor text-[#FFF] text-[12px] lg:text-[16px] py-1 px-2 lg:py-2 lg:px-6 font-semibold leading-4 lg:leading-7 rounded">
          {specialization}
        </span>
        <div className="flex items-center gap-[6px]">
          <span className="flex items-center font-semibold text-headingColor text-headingColor gap-[6px] text-[14px] lg:text-[16px] leading-6 lg:leading-7 ">
            <img src={starIcon} alt="" />
            {avgRating}{" "}
          </span>
          <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
            ({totalRating})
          </span>
        </div>
      </div>
      <div className="mt-[18px] lg:mt-5 flex item-center justify-between">
        <div>
          <h3 className="text-[16px] leading-7 lg:text-[18px] lg;leading-[30px] font-semibold text-headingColor">
            +{totalPatients} patients
          </h3>
          <p className="text-[14px] leading-6 font-[400] text-textColor">
            At {hospital}
          </p>
        </div>
        <Link
          to={`/doctors/${doctor._id}`}
          className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-buttonColor hover:border-none "
        >
          <BsArrowRight className="group-hover:text-white w-6 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;