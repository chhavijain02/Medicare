// /* eslint-disable react/prop-types */
// // This file is used to design Side Panel(Doctor timings info) in Doctor Detail's Page

// import convertTime from "../../utils/convertTime"
// import { BASE_URL, token } from "./../../config"
// import { toast } from "react-toastify"

// const SidePanel = ({doctorId, ticketPrice, timeSlots}) => {
//   const bookingHandler = async()=> {
//     try {
//       const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}`, {
//         method:'post',
//         headers:{
//           Authorization:`Bearer ${token}`,
//         }
//       })
//       const data = await res.json()
//       if(!res.ok) {
//         throw new Error(data.message + 'Please try again')
//       }

//       if(data.session.url) {
//         window.location.href = data.session.url
//       }

//     } catch (err) {
//       toast.error(err.message)
//     }
//   }

//     return (
//       <div className='shadow-panelShadow p-3 lg:p-5 rounded-md'>
//           <div className='flex items-center justify-between'>
//               <p className='text__para mt-0 font-semibold'>
//                   Consultation fee
//             </p>
//               <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold'>
//               ₹ {ticketPrice}
//             </span>
//           </div>

//           <div className='mt-[30px]'>
//               <p className='text__para mt-0 font-semibold text-headingColor'>
//                   Available Time Slots:
//               </p>

//               <ul className="mt-3">
//                 { timeSlots?.map((item, index) => (
//                     <li key={index} className='flex items-center justify-between mb-2'>
//                         <p className='text-[15px] leading-6 text-textColor font-semibold'>
//                             {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
//                         </p>
//                         <p className='text-[15px] leading-6 text-textColor font-semibold'>
//                             {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
//                         </p>
//                     </li>
//                 ))}
//               </ul>
//           </div>

//           <button
//             onClick={bookingHandler}
//             className='btn px-2 w-full rounded-md'>
//             Book Appointment
//           </button>
//       </div>
//     )
//   }

//   export default SidePanel

//Yeh upr wala original code h lekin I want how the niche wala code is working jisme day or timeslots aare h or select krne pe blue bhi hora h bss database me store nhi hora to vo badme krugi or thoda profile wala code ko update krne ke bad isko update krege


import { useState, useEffect } from 'react';
import { BASE_URL, token } from "./../../config";
import { toast } from "react-toastify";

const SidePanel = ({ doctorId, ticketPrice, timeSlots = [] }) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [allTimeSlots, setAllTimeSlots] = useState(timeSlots);

  useEffect(() => {
    if (timeSlots.length > 0) {
      const nextDay = timeSlots[0].day;
      setSelectedDay(nextDay);
      updateAvailableTimes(nextDay);
    }
  }, [timeSlots]);

  const updateAvailableTimes = (day) => {
    const slots = allTimeSlots.find(slot => slot.day === day);
    if (slots) {
      const times = generateTimeSlots(slots.startingTime, slots.endingTime);
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };

  const generateTimeSlots = (startingTime, endingTime) => {
    const times = [];
    let currentTime = startingTime;

    while (currentTime < endingTime) {
      times.push(currentTime);
      currentTime = addMinutes(currentTime, 30);
    }

    return times;
  };

  const addMinutes = (time, minutesToAdd) => {
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);

    minutes += minutesToAdd;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);
    updateAvailableTimes(day);
    setSelectedTime(''); // Reset selected time on day change
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const bookingHandler = async () => {
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message + ' Please try again');
      }

      if (data.session.url) {
        window.location.href = data.session.url;
      }

      // Remove the booked time slot from available times after payment is completed
      const updatedTimeSlots = allTimeSlots.map(slot => {
        if (slot.day === selectedDay) {
          const newTimes = generateTimeSlots(slot.startingTime, slot.endingTime).filter(time => time !== selectedTime);
          return {
            ...slot,
            startingTime: newTimes.length > 0 ? newTimes[0] : '',
            endingTime: newTimes.length > 0 ? newTimes[newTimes.length - 1] : '',
          };
        }
        return slot;
      });

      setAllTimeSlots(updatedTimeSlots);
      updateAvailableTimes(selectedDay);
      setSelectedTime('');

    } catch (err) {
      toast.error(err.message);
    }
  };

  const timeSlotsMatrix = availableTimes.map(time => (
    <div
      key={time}
      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
      onClick={() => handleTimeSelect(time)}
    >
      {time}
    </div>
  ));

  return (
    <div className='shadow-panelShadow p-3 lg:p-5 rounded-md'>
      <div className='flex items-center justify-between'>
        <p className='text__para mt-0 font-semibold'>
          Consultation fee
        </p>
        <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold'>
          ₹ {ticketPrice}
        </span>
      </div>

      <div className='mt-[30px]'>
        <p className='text__para mt-0 font-semibold text-headingColor'>
          Available Days:
        </p>
        <select value={selectedDay} onChange={handleDayChange}>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot.day}>
              {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className='mt-[30px]'>
        <p className='text__para mt-0 font-semibold text-headingColor'>
          Available Time Slots:
        </p>
        <div className='time-slot-matrix'>
          {timeSlotsMatrix}
        </div>
      </div>

      <button
        onClick={bookingHandler}
        className='btn px-2 w-full rounded-md mt-5'>
        Book Appointment
      </button>
    </div>
  );
};

export default SidePanel;



// import { useState, useEffect } from "react";
// import { BASE_URL, token } from "./../../config";
// import { toast } from "react-toastify";

// const SidePanel = ({ doctorId, ticketPrice, timeSlots = [] }) => {
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [availableTimes, setAvailableTimes] = useState([]);
//   console.log("TimeSlot:", timeSlots);

//   useEffect(() => {
//     if (timeSlots.length > 0) {
//       // By default, select the next available day
//       const nextDay = timeSlots[0].day;
//       setSelectedDay(nextDay);
//       updateAvailableTimes(nextDay);
//     }
//   }, [timeSlots]);

//   const updateAvailableTimes = (day) => {
//     const slots = timeSlots.find((slot) => slot.day === day);
//     if (slots) {
//       const times = generateTimeSlots(slots.startingTime, slots.endingTime);
//       setAvailableTimes(times);
//     } else {
//       setAvailableTimes([]);
//     }
//   };

//   const handleDayChange = (e) => {
//     const day = e.target.value;
//     setSelectedDay(day);
//     updateAvailableTimes(day);
//     setSelectedTime(""); // Reset selected time on day change
//   };

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//   };

//   const bookingHandler = async () => {
//     if (!selectedTime) {
//       toast.error("Please select a time slot");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${BASE_URL}/bookings/checkout-session/${doctorId}`,
//         {
//           method: "post",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message + " Please try again");
//       }

//       if (data.session.url) {
//         window.location.href = data.session.url;
//       }
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const generateTimeSlots = (startingTime, endingTime) => {
//     const times = [];
//     let currentTime = startingTime;

//     while (currentTime <= endingTime) {
//       times.push(currentTime);
//       // Increment currentTime by 30 minutes
//       currentTime = addMinutes(currentTime, 30);
//     }

//     return times;
//   };

//   // Helper function to add minutes to a time string (e.g., '10:00')
//   const addMinutes = (time, minutesToAdd) => {
//     const [hoursStr, minutesStr] = time.split(":");
//     let hours = parseInt(hoursStr, 10);
//     let minutes = parseInt(minutesStr, 10);

//     minutes += minutesToAdd;
//     hours += Math.floor(minutes / 60);
//     minutes = minutes % 60;

//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const timeSlotsMatrix = availableTimes.map(time => (
//     <div
//       key={time}
//       className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
//       onClick={() => handleTimeSelect(time)}
//     >
//       {time}
//     </div>
//   ));
//   return (
//     <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
//       <div className="flex items-center justify-between">
//         <p className="text__para mt-0 font-semibold">Consultation fee</p>
//         <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
//           ₹ {ticketPrice}
//         </span>
//       </div>

//       <div className='mt-[30px]'>
//         <p className='text__para mt-0 font-semibold text-headingColor'>
//           Available Days:
//         </p>
//         <select value={selectedDay} onChange={handleDayChange}>
//           {timeSlots.map((slot, index) => (
//             <option key={index} value={slot.day}>
//               {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className='mt-[30px]'>
//         <p className='text__para mt-0 font-semibold text-headingColor'>
//           Available Time Slots:
//         </p>
//         <div className='time-slot-matrix'>
//           {timeSlotsMatrix}
//         </div>
//       </div>

//       <button
//         onClick={bookingHandler}
//         className="btn px-2 w-full rounded-md mt-5"
//       >
//         Book Appointment
//       </button>
//     </div>
//   );
// };

// export default SidePanel;
