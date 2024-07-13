import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaArrowLeft } from "react-icons/fa";

const FilterModal = ({
  showFilterModal,
  specializations,
  onApply,
  onClose,
}) => {
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setSelectedSpecializations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    onApply(selectedSpecializations, minPrice, maxPrice);
    onClose();
  };
  const handleSliderChange = (value) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  return (
    <div className={`modal ${showFilterModal ? "visible" : "hidden"}`}>
      <div className="modal-content">
        <div className="modal-header">
          <FaArrowLeft className="back-icon" onClick={onClose} />
          <h2 className="header-text">All Filters</h2>
        </div>
        <div className="divider"></div>
        <div className="modal-body">
          <div className="price-slider">
            <h3 className="filter-label">Price Per Visit</h3>
            <Slider
              min={0}
              max={1000}
              defaultValue={[minPrice, maxPrice]}
              onChange={handleSliderChange}
              range
            />
            <p className="price-range">
              ₹{minPrice} - ₹{maxPrice}
            </p>
          </div>
          <div className="specializations-list">
            <h3 className="filter-label">Specializations</h3>

            {specializations.map((specialization) => (
              <div key={specialization}>
                <input
                  type="checkbox"
                  value={specialization}
                  onChange={handleSpecializationChange}
                />
                <label>   {specialization}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="apply-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

// import React, { useState } from 'react';
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';

// const FilterModal = ({ specializations, onApply, onClose }) => {
//   const [selectedSpecializations, setSelectedSpecializations] = useState([]);

//   const handleSpecializationChange = (e) => {
//     const value = e.target.value;
//     setSelectedSpecializations((prevSpecializations) => {
//       if (prevSpecializations.includes(value)) {
//         return prevSpecializations.filter((spec) => spec !== value);
//       } else {
//         return [...prevSpecializations, value];
//       }
//     });
//   };

//   const handleApplyFilters = () => {
//     // Assuming you have minPrice and maxPrice states here
//     onApply(selectedSpecializations, minPrice, maxPrice);
//     onClose();
//   };

//   return (
//     <div className="modal visible">
//       <div className="modal-content">
//         <h2>Filters</h2>
//         <div className="filter-section">
//           <h3>Specializations</h3>
//           <div className="specialization-options">
//             {specializations.map((spec) => (
//               <label key={spec}>
//                 <input
//                   type="checkbox"
//                   value={spec}
//                   checked={selectedSpecializations.includes(spec)}
//                   onChange={handleSpecializationChange}
//                 />
//                 {spec}
//               </label>
//             ))}
//           </div>
//         </div>
//         <div className="filter-section">
//           {/* Add your price slider here */}
//           <h3>Price Range</h3>
//           <Slider
//             min={0}
//             max={100}
//             defaultValue={[0, 100]}
//             onChange={(value) => {
//               setMinPrice(value[0]);
//               setMaxPrice(value[1]);
//             }}
//           />
//         </div>
//         <button onClick={handleApplyFilters}>Apply Filters</button>
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default FilterModal;

// import React, { useState } from 'react';
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';

// const FilterModal = ({ showFilterModal,specializations, onApply, onClose }) => {
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(100);

//   const handleApply = () => {
//     // Pass selected values back to parent component
//     onApply(specializations, cities, minPrice, maxPrice);
//     onClose(); // Close the modal after applying filters
//   };

//   return (
//     <div className={`modal ${showFilterModal ? 'visible' : 'hidden'}`}>
//       <h3>Filters</h3>
//       {/* Price Range Slider */}
//       <div className="price-slider">
//         <p>Price Range</p>
//         <Slider
//           min={0}
//           max={100}
//           defaultValue={[minPrice, maxPrice]}
//           onChange={value => {
//             setMinPrice(value[0]);
//             setMaxPrice(value[1]);
//           }}
//           range
//         />
//         <p>{`$${minPrice} - $${maxPrice}`}</p>
//       </div>
//       <button onClick={handleApply}>Apply Filters</button>
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default FilterModal;
