/* eslint-disable react/prop-types */
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ServiceCard = ({ item, index }) => {
  const { name, desc, bgColor, textColor } = item;
  console.log('bgColor:', bgColor);
  console.log('textColor:', textColor);
  return (
    <div className="py-[30px] px-3 lg:px-5">
      <h2 className="text-[26px] leading-9 text-headingColor font-[700]">
        {name}
      </h2>
      <p className="text-[16px] leading-7 font-[400] text-textColor">{desc}</p>
      <div className="flex items-center justify-between mt-[30px]">
        <Link
          to="/doctors"
          className=" rounded-full border border-solid border-white mt-[30px] mx-auto flex items-center justify-center group  hover:border-none "
          style={{
            background: bgColor,
            color: textColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'white';
            e.currentTarget.querySelector('svg').style.color = 'white';
            e.currentTarget.style.background = 'black';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textColor;
            e.currentTarget.querySelector('svg').style.color = textColor;
            e.currentTarget.style.background = bgColor;
          }}
        >
          <BsArrowRight className="group  w-10 h-10 rounded-full p-1 "  />
        </Link>
        {/* <span
          className="w-[44px] h-[44px] flex items-center justify-center text-[18px] leading-[30px] font-[600]" 
        
        style={{
          background: bgColor,
          color: textColor,
        }}>
          {index + 1}
        </span> */}
      </div>
    </div>
  );
};

export default ServiceCard;
