// import React, { useState, useEffect } from 'react';
// import DoctorCard from "./../../components/Doctors/DoctorCard";
// import Testimonial from "../../components/Testimonial/Testimonial";
// import useFetchData from "./../../hooks/useFetchData";
// import { BASE_URL } from "./../../config";
// import FilterModal from "./../../components/Find/FilterModal.jsx";
// import { FaFilter } from 'react-icons/fa';

// const Doctors = () => {
//   const [query, setQuery] = useState('');
//   const [specializations, setSpecializations] = useState([]);
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(100);
//   const [debounceQuery, setDebounceQuery] = useState('');
//   const [debounceSpecializations, setDebounceSpecializations] = useState([]);
//   const [showFilterModal, setShowFilterModal] = useState(false);

//   const handleSearch = () => {
//     setDebounceQuery(query.trim());
//     setDebounceSpecializations(specializations);
//   };

//   const handleApplyFilters = (selectedSpecializations, minPrice, maxPrice) => {
//     setSpecializations(selectedSpecializations);
//     setMinPrice(minPrice);
//     setMaxPrice(maxPrice);
//     setDebounceQuery(query.trim());
//     setDebounceSpecializations(selectedSpecializations);
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDebounceQuery(query);
//       setDebounceSpecializations(specializations);
//     }, 700);

//     return () => clearTimeout(timeout);
//   }, [query, specializations]);

//   const { data: doctors, loading, error } = useFetchData(
//     `${BASE_URL}/doctors?query=${debounceQuery}&specializations=${debounceSpecializations.join(',')}&minPrice=${minPrice}&maxPrice=${maxPrice}`
//   );

//   return (
//     <>
//       <section className="bg-[#fff9ea]">
//         <div className="container text-center">
//           <h2 className="heading">Find a Doctor</h2>
//           <div className="max-w-[570px] mt-[30px] mx-auto rounded-md flex item-center justify-between">
            // <input
            //   type="search"
            //   className="py-4 pl-4 pr-2 bg-[#0066ff2c] w-full focus:outline-none cursor-pointer placeholder:text-textColor"
            //   placeholder="Search by Doctor Name, Specialization or City"
            //   value={query}
            //   onChange={(e) => setQuery(e.target.value)}
            // />
            // <button className="btn mt-0 rounded-[0px] rounded-r-md" onClick={handleSearch}>
            //   Search
            // </button>
            // <button className="btn mt-0 rounded-[0px] rounded-r-md rounded-l-md ml-4" onClick={() => setShowFilterModal(true)}>
            //   <FaFilter style={{ color: 'white' }} />
            // </button>
//           </div>
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           {loading && <p>Loading...</p>}
//           {error && <p>{error}</p>}
//           {doctors.length === 0 && !loading && <p>No doctors available at the moment!!😑   </p>}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//             {doctors.map(doctor => (
//               <DoctorCard key={doctor.id} doctor={doctor} />
//             ))}
//           </div>
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           <div className="xl:w-[470px] mx-auto">
//             <h2 className="heading text-center">What our patients say</h2>
//             <p className="text_para text-center">
//               World-class care for everyone. Our health system offers unmatched, expert health care
//             </p>
//           </div>
//           <Testimonial />
//         </div>
//       </section>

//       {showFilterModal && (
//         <FilterModal
//           showFilterModal
//           specializations={[
//             "Cardiologist", "Surgeon", "Dermatologist", "Gynecologist", "Psychiatrist",
//             "Neurologist", "Pediatrics", "Physician", "Dentist", "Hematologist", "Nephrologist"
//           ]}
//           onApply={handleApplyFilters}
//           onClose={() => setShowFilterModal(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Doctors;

// import React, { useState, useEffect } from 'react';
// import DoctorCard from "./../../components/Doctors/DoctorCard";
// import Testimonial from "../../components/Testimonial/Testimonial";
// import useFetchData from "./../../hooks/useFetchData";
// import { BASE_URL } from "./../../config";
// import FilterModal from "./../../components/Find/FilterModal.jsx";
// import { FaFilter } from "react-icons/fa";

// const Doctors = () => {
//   const [query, setQuery] = useState('');
//   const [specializations, setSpecializations] = useState([]);
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(1000);
//   const [debounceQuery, setDebounceQuery] = useState('');
//   const [debounceSpecializations, setDebounceSpecializations] = useState([]);
//   const [showFilterModal, setShowFilterModal] = useState(false);

//   const handleSearch = () => {
//     setDebounceQuery(query.trim());
//     setDebounceSpecializations(specializations);
//   };

//   const handleApplyFilters = (selectedSpecializations, minPrice, maxPrice) => {
//     setSpecializations(selectedSpecializations);
//     setMinPrice(minPrice);
//     setMaxPrice(maxPrice);
//     setDebounceQuery(query.trim());
//     setDebounceSpecializations(selectedSpecializations);
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDebounceQuery(query);
//       setDebounceSpecializations(specializations);
//     }, 700);

//     return () => clearTimeout(timeout);
//   }, [query, specializations]);

//   const { data: doctors, loading, error } = useFetchData(
//     `${BASE_URL}/doctors?query=${debounceQuery}&specializations=${debounceSpecializations.join(',')}&minPrice=${minPrice}&maxPrice=${maxPrice}`
//   );  

//   return (
//     <>
//       <section className="bg-[#fff9ea]">
//         <div className="container text-center">
//           <h2 className="heading">Find a Doctor</h2>
//           <div className="max-w-[570px] mt-[30px] mx-auto rounded-md flex items-center justify-between">
//           <input
//               type="search"
//               className="py-4 pl-4 pr-2 h-[53px] bg-[#0066ff2c] w-full focus:outline-none cursor-pointer placeholder:text-textColor"
//               placeholder="Doctor Name, Specialization or City"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//             <button className="btn mt-0 h-[53px] rounded-[0px] rounded-r-md" onClick={handleSearch}>
//               Search
//             </button>
//             <button className="btn mt-0 h-[53px] rounded-[0px] rounded-r-md rounded-l-md ml-4" onClick={() => setShowFilterModal(true)}>
//               <FaFilter style={{ color: 'white' }} />
//             </button>
//           </div>
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           {loading && <p>Loading...</p>}
//           {error && <p>{error}</p>}
//           {doctors.length === 0 ? (
//             <p>No doctors available at the moment!!😑</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//               {doctors.map(doctor => (
//                 <DoctorCard key={doctor.id} doctor={doctor} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           <div className="xl:w-[470px] mx-auto">
//             <h2 className="heading text-center">What our patients say</h2>
//             <p className="text_para text-center">
//               World-class care for everyone. Our health system offers unmatched, expert health care
//             </p>
//           </div>
//           <Testimonial />
//         </div>
//       </section>

//       {showFilterModal && (
//         <FilterModal
//           showFilterModal
//           specializations={["Cardiologist","Surgeon","Dermatologist","Gynecologist","Psychiatrist", "Neurologist", "Pediatrics","Physician","Dentist","Hematologist","Nephrologist"]}
//           onApply={handleApplyFilters}
//           onClose={() => setShowFilterModal(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Doctors;










// import { doctors } from "./../../assets/data/doctors.js";
// import { useEffect, useState } from 'react';
// import DoctorCard from "./../../components/Doctors/DoctorCard";
// import Testimonial from "../../components/Testimonial/Testimonial";
// import useFetchData from "./../../hooks/useFetchData";
// import { BASE_URL } from "./../../config";

// const Doctors = () => {
//   const [query, setQuery] = useState('');
//   const [debounceQuery, setDebounceQuery] = useState("");

//   const handleSearch = () => {
//     setQuery(query.trim())

//     console.log('handle search')
//   }

//   useEffect(()=> {

//     const timeout = setTimeout(() => {
//       setDebounceQuery(query)
//     },700)

//     return () => clearTimeout(timeout);
//   },[query])

//   const {
//     data:doctors, 
//     loading, 
//     error
//   } = useFetchData(`${BASE_URL}/doctors?query=${debounceQuery}`)

//   return (
//     <>
//       <section className="bg-[#fff9ea]">
//         <div className="container text-center">
//             <h2 className="heading">Find a Doctor</h2>
//             <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex item-center justify-between">
//               <input
//                 type="search" 
//                 className='py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor' 
//                 placeholder='Search by Doctor name or Specialization'
//                 value={query} 
//                 onChange={e => setQuery(e.target.value)}
//               />
//               <button className="btn mt-0 rounded-[0px] rounded-r-md" onClick={handleSearch}>
//                 Search
//               </button>
//             </div>
//           </div>
//       </section>

//       <section>
//         <div className="container">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//             {doctors.map(doctor => (
//               <DoctorCard key={doctor.id} doctor={doctor} />
//             ))}
//           </div>
//         </div>
//       </section>

//       <section>
//         <div className="container">
//           <div className="xl:w-[470px] mx-auto">
//             <h2 className="heading text-center">What our paient say</h2>
//             <p className="text_para text-center">
//               World-class care for everyone. Our health system offers unmatched,
//               expert health care
//             </p>
//           </div>
//           <Testimonial />
//         </div>
//       </section>
//     </>
//   );
// };

// export default Doctors;


import React, { useState, useEffect, useRef } from 'react';
import DoctorCard from "./../../components/Doctors/DoctorCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import useFetchData from "./../../hooks/useFetchData";
import { BASE_URL } from "./../../config";
import FilterModal from "./../../components/Find/FilterModal.jsx";
import { FaFilter } from "react-icons/fa";

const Doctors = () => {
  const [query, setQuery] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [debounceQuery, setDebounceQuery] = useState('');
  const [debounceSpecializations, setDebounceSpecializations] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleSearch = () => {
    setDebounceQuery(query.trim());
    setDebounceSpecializations(specializations);
  };

  const handleApplyFilters = (selectedSpecializations, minPrice, maxPrice) => {
    setSpecializations(selectedSpecializations);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    setDebounceQuery(query.trim());
    setDebounceSpecializations(selectedSpecializations);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
      setDebounceSpecializations(specializations);
    }, 700);

    return () => clearTimeout(timeout);
  }, [query, specializations]);

  const { data: doctors, loading, error } = useFetchData(
    `${BASE_URL}/doctors?query=${debounceQuery}&specializations=${debounceSpecializations.join(',')}&minPrice=${minPrice}&maxPrice=${maxPrice}`
  );  

  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 h-[53px] bg-[#0066ff2c] w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Doctor Name, Specialization or City"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn mt-0 h-[53px] rounded-[0px] rounded-r-md" onClick={handleSearch}>
              Search
            </button>
            <button className="btn mt-0 h-[53px] rounded-[0px] rounded-r-md rounded-l-md ml-4" onClick={() => setShowFilterModal(true)}>
              <FaFilter style={{ color: 'white' }} />
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {doctors && doctors.length === 0 ? (
            <p>No doctors available at the moment!!😑</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {doctors && doctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our patients say</h2>
            <p className="text_para text-center">
              World-class care for everyone. Our health system offers unmatched, expert health care
            </p>
          </div>
          <Testimonial />
        </div>
      </section>

      {showFilterModal && (
        <FilterModal
          showFilterModal
          specializations={["Cardiologist","Surgeon","Dermatologist","Gynecologist","Psychiatrist", "Neurologist", "Pediatrics","Physician","Dentist","Hematologist","Nephrologist"]}
          onApply={handleApplyFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </>
  );
};

export default Doctors;
