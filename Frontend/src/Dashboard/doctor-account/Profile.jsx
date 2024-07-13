import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import uploadImageToCloudinary from "./../../utils/uploadCloudinary";
import { BASE_URL, token } from "./../../config";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const Profile = ({ doctorData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    qualifications: [],
    experiences: [],
    timeSlots: [],
    about: "",
    photo: null,
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [croppedArea, setCroppedArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);
  const [cityid, setCityid] = useState(0);

  useEffect(() => {
    setFormData({
      name: doctorData?.name,
      email: doctorData?.email,
      phone: doctorData?.phone,
      bio: doctorData?.bio,
      gender: doctorData?.gender,
      specialization: doctorData?.specialization,
      ticketPrice: doctorData?.ticketPrice,
      qualifications: doctorData?.qualifications,
      experiences: doctorData?.experiences,
      timeSlots: doctorData?.timeSlots,
      about: doctorData?.about,
      photo: doctorData?.photo,
      address: {
        line1: doctorData?.address?.line1 || "",
        line2: doctorData?.address?.line2 || "",
        city: doctorData?.address?.city || "",
        state: doctorData?.address?.state || "",
        country: doctorData?.address?.country || "",
        pincode: doctorData?.address?.pincode || "",
      },
    });
  }, [doctorData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const phoneRegex = /^[0-9]{0,10}$/;
  
    if (phoneRegex.test(value)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  //Address Update
  const handleCountryChange = (country) => {
    setCountryid(country.id);
    setStateid(0);
    setCityid(0);
  };

  const handleStateChange = (state) => {
    setStateid(state.id);
    setCityid(0);
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        state: state.name,
        city: "",
      },
    }));
  };

  const handleCityChange = (city) => {
    setCityid(city.id);
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        city: city.name,
      },
    }));
  };

  // Photo Update
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setIsCropping(true);
    };
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedArea);
    setCroppedImage(croppedImage);
    setFormData({ ...formData, photo: croppedImage });
    setIsCropping(false);
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updatedFormData = { ...formData };

      if (croppedImage) {
        const data = await uploadImageToCloudinary(croppedImage);
        updatedFormData.photo = data?.url;
      }

      const res = await fetch(`${BASE_URL}/doctors/${doctorData._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw Error(result.message);
      }

      setLoading(false);
      setProfileUpdateSuccess(true);
      toast.success(result.message);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  // function for adding item
  const addItem = (key, item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...prevFormData[key], item],
    }));
  };

  // input change function
  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updateItems = [...prevFormData[key]];
      updateItems[index][name] = value;

      return {
        ...prevFormData,
        [key]: updateItems,
      };
    });
  };

  // function for deleting item
  const deleteItem = (key, index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: prevFormData[key].filter((_, i) => i !== index),
    }));
  };

  //Qualification Update
  const addQualification = (e) => {
    e.preventDefault();

    addItem("qualifications", {
      startingDate: "",
      endingDate: "",
      degree: "",
      university: "",
    });
  };
  const handleQualificationChange = (event, index) => {
    handleReusableInputChangeFunc("qualifications", index, event);
  };
  const deleteQualification = (e, index) => {
    e.preventDefault();
    deleteItem("qualifications", index);
  };

  //Experience Update
  const addExperience = (e) => {
    e.preventDefault();

    addItem("experiences", {
      startingDate: "",
      endingDate: "",
      position: "",
      hospital: "",
    });
  };
  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc("experiences", index, event);
  };
  const deleteExperience = (e, index) => {
    e.preventDefault();
    deleteItem("experiences", index);
  };

  //TimeSlot Update
  const addTimeSlot = (e) => {
    e.preventDefault();

    addItem("timeSlots", {
      day: "",
      startingTime: "",
      endingTime: "",
    });
  };
  const handleTimeSlotChange = (event, index) => {
    handleReusableInputChangeFunc("timeSlots", index, event);
  };
  const deleteTimeSlot = (e, index) => {
    e.preventDefault();
    deleteItem("timeSlots", index);
  };

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>

      <form>
        {/*---------Name Input----------- */}
        <div className="mb-5">
          <p className="form__label">Name*</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="form__input"
          />
        </div>

        {/*--------- Email Input ----------- */}
        <div className="mb-5">
          <p className="form__label">Email Address*</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form__input"
            readOnly
            aria-readonly
            disabled
          />
        </div>

        {/*--------- Phone number Input ----------- */}
        <div className="mb-5">
          <p className="form__label">Phone*</p>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="Phone number"
            className="form__input"
            maxLength="10"
          />
        </div>

        {/*--------- This is for the Bio Input ----------- */}
        <div className="mb-5">
          <p className="form__label">Bio*</p>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="form__input"
            maxLength={100}
          />
        </div>

        {/*--------- This is for the Gender, Specialization & Ticket Price Input ----------- */}
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-5 mb-[30px]">
            {/*--------- This is for the Gender Input ----------- */}
            <div>
              <p className="form__label">Gender*</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/*--------- This is for the Specialization Input ----------- */}
            <div>
              <p className="form__label">Specialization*</p>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Physician">Physician</option>
                <option value="Dentist">Dentist</option>
                <option value="Nephrologist">Nephrologist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Hematologist">Hematologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Allergists">Allergists</option>
                <option value="Oncologist">Oncologist</option>
                <option value="Orthopaedist">Orthopaedist</option>
              </select>
            </div>
            {/*--------- This is for the Ticket Price Input ----------- */}
            <div>
              <p className="form__label">Ticket Price*</p>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                placeholder="Ticket Price"
                className="form__input"
              />
            </div>
          </div>
        </div>

        {/*--------- This is for the Qualifications Input ----------- */}
        <div className="mb-5">
          <p className="form__label">Qualifications*</p>
          {formData.qualifications.map((qualification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-5 gap-5 items-center"
            >
              <input
                type="text"
                name="degree"
                value={qualification.degree}
                onChange={(event) => handleQualificationChange(event, index)}
                placeholder="Degree"
                className="form__input"
              />
              <input
                type="text"
                name="university"
                value={qualification.university}
                onChange={(event) => handleQualificationChange(event, index)}
                placeholder="University"
                className="form__input"
              />
              <input
                type="date"
                name="startingDate"
                value={qualification.startingDate}
                onChange={(event) => handleQualificationChange(event, index)}
                placeholder="Starting Date"
                className="form__input"
              />
              <input
                type="date"
                name="endingDate"
                value={qualification.endingDate}
                onChange={(event) => handleQualificationChange(event, index)}
                placeholder="Ending Date"
                className="form__input"
              />
              <button
                className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600"
                onClick={(e) => deleteQualification(e, index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600"
            onClick={addQualification}
          >
            Add Qualification
          </button>
        </div>

        {/*--------- This is for the Experience Input ----------- */}
        <div className="mb-5">
          <p className="form__label">Experience*</p>
          {formData.experiences.map((experience, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-5 gap-5 items-center"
            >
              <input
                type="text"
                name="position"
                value={experience.position}
                onChange={(event) => handleExperienceChange(event, index)}
                placeholder="Position"
                className="form__input"
              />
              <input
                type="text"
                name="hospital"
                value={experience.hospital}
                onChange={(event) => handleExperienceChange(event, index)}
                placeholder="Hospital"
                className="form__input"
              />
              <input
                type="date"
                name="startingDate"
                value={experience.startingDate}
                onChange={(event) => handleExperienceChange(event, index)}
                placeholder="Starting Date"
                className="form__input"
              />
              <input
                type="date"
                name="endingDate"
                value={experience.endingDate}
                onChange={(event) => handleExperienceChange(event, index)}
                placeholder="Ending Date"
                className="form__input"
              />
              <button
                className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600"
                onClick={(e) => deleteExperience(e, index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600"
            onClick={addExperience}
          >
            Add Experience
          </button>
        </div>

        {/*--------- This is for the Time Slot Input ----------- */}
        <div className="mb-5">
          <p className="form__label">Time Slots*</p>
          {formData.timeSlots.map((timeSlot, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-5 gap-5 items-center"
            >
              <select
                name="day"
                value={timeSlot.day}
                onChange={(event) => handleTimeSlotChange(event, index)}
                className="form__input py-3.5"
              >
                <option value="">Select Day</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
              <input
                type="time"
                name="startingTime"
                value={timeSlot.startingTime}
                onChange={(event) => handleTimeSlotChange(event, index)}
                placeholder="Starting Time"
                className="form__input"
              />
              <input
                type="time"
                name="endingTime"
                value={timeSlot.endingTime}
                onChange={(event) => handleTimeSlotChange(event, index)}
                placeholder="Ending Time"
                className="form__input"
              />
              <button
                className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600"
                onClick={(e) => deleteTimeSlot(e, index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600"
            onClick={addTimeSlot}
          >
            Add Time Slot
          </button>
        </div>

        {/* Address Field */}
        <div className="mb-5">
          <p className="form__label">Address Line 1*</p>
          <input
            type="text"
            name="address.line1"
            value={formData.address.line1}
            onChange={handleInputChange}
            placeholder="Address Line 1"
            className="form__input"
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Address Line 2</p>
          <input
            type="text"
            name="address.line2"
            value={formData.address.line2}
            onChange={handleInputChange}
            placeholder="Address Line 2"
            className="form__input"
          />
        </div>

        <h6>Country</h6>
        <CountrySelect
          onChange={handleCountryChange}
          placeHolder="Select Country"
        />

        <h6>State</h6>
        <StateSelect
          countryid={countryid}
          onChange={handleStateChange}
          placeHolder="Select State"
        />

        <h6>City</h6>
        <CitySelect
          countryid={countryid}
          stateid={stateid}
          onChange={handleCityChange}
          placeHolder="Select City"
        />

        <div className="mb-5">
          <p className="form__label">Pincode*</p>
          <input
            type="text"
            name="address.pincode"
            value={formData.address.pincode}
            onChange={handleInputChange}
            placeholder="Pincode"
            className="form__input"
          />
        </div>

        {/*--------- This is for the About Input ----------- */}
        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="Write about yourself"
            className="form__input"
            rows="4"
          />
        </div>

        {/*--------- This is for the Photo Upload Input ----------- */}
        <div className="mb-5">
          <p className="form__label">Photo*</p>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileInputChange}
            className="form__input"
          />
        </div>

        {/*--------- This is for the Save button ----------- */}
        <div className="mt-6 lg:mt-8">
          <button
            disabled={loading}
            onClick={updateProfileHandler}
            type="submit"
            className={`w-full text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 transition-all duration-300 ${
              loading || profileUpdateSuccess
                ? "bg-gradient-to-r from-[#005EEB] to-[#69E6FF]"
                : "bg-gradient-to-r from-primaryColor to-[#AEC7EB]"
            } flex justify-center items-center`}
          >
            {profileUpdateSuccess ? (
              <FaCheckCircle size={25} color="#fff" />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>

      {isCropping && (
        <div className="w-full h-full flex justify-center items-center bg-black bg-opacity-50 fixed top-0 left-0 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg relative w-3/4 h-3/4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
            <div className="absolute bottom-3 right-3">
              <IconButton
                className="bg-green-500 text-white p-2 rounded-full mr-2"
                onClick={handleCropConfirm}
              >
                <FaCheckCircle size={25} color="#000" />
              </IconButton>
              <IconButton
                className="bg-red-500 text-white p-2 rounded-full"
                onClick={() => setIsCropping(false)}
              >
                <MdDelete size={25} color="#000" />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

// import { useEffect, useState } from "react";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "../../utils/cropImage";
// import uploadImageToCloudinary from "./../../utils/uploadCloudinary";
// import { BASE_URL, token } from "./../../config";
// import { toast } from "react-toastify";
// import { IconButton } from "@mui/material";
// import { MdDelete } from "react-icons/md";
// import { FaCheckCircle } from "react-icons/fa";
// import {
//   CitySelect,
//   CountrySelect,
//   StateSelect,
//   LanguageSelect
// } from 'react-country-state-city';
// import 'react-country-state-city/dist/react-country-state-city.css';

// const Profile = ({ doctorData }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     bio: "",
//     gender: "",
//     specialization: "",
//     ticketPrice: 0,
//     qualifications: [],
//     experiences: [],
//     timeSlots: [],
//     about: "",
//     photo: null,
//     address: {
//       line1: "",
//       line2: "",
//       city: "",
//       state: "",
//       country: "",
//       pincode: "",
//     },
//   });

//   const [imageSrc, setImageSrc] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
//   const [croppedArea, setCroppedArea] = useState(null);
//   const [isCropping, setIsCropping] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [countryid, setCountryid] = useState(0);
//   const [stateid, setStateid] = useState(0);
//   const [cityid, setCityid] = useState(0);

//   useEffect(() => {
//     setFormData({
//       name: doctorData?.name,
//       email: doctorData?.email,
//       phone: doctorData?.phone,
//       bio: doctorData?.bio,
//       gender: doctorData?.gender,
//       specialization: doctorData?.specialization,
//       ticketPrice: doctorData?.ticketPrice,
//       qualifications: doctorData?.qualifications,
//       experiences: doctorData?.experiences,
//       timeSlots: doctorData?.timeSlots,
//       about: doctorData?.about,
//       photo: doctorData?.photo,
//       address: {
//         line1: doctorData?.address?.line1 || "",
//         line2: doctorData?.address?.line2 || "",
//         city: doctorData?.address?.city || "",
//         state: doctorData?.address?.state || "",
//         country: doctorData?.address?.country || "",
//         pincode: doctorData?.address?.pincode || "",
//       },
//     });
//   }, [doctorData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith("address.")) {
//       const addressField = name.split(".")[1];
//       setFormData((prevData) => ({
//         ...prevData,
//         address: {
//           ...prevData.address,
//           [addressField]: value,
//         },
//       }));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

// const handleCountryChange = (country) => {
//   setCountryid(country.id);
//   // Reset state and city selections
//   setStateid(0);
//   setCityid(0);
// };

// const handleStateChange = (state) => {
//   setStateid(state.id);
//   // Reset city selection
//   setCityid(0);
// };

// const handleCityChange = (city) => {
//   setCityid(city.id);
// };

//   const handleFileInputChange = async (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setImageSrc(reader.result);
//       setIsCropping(true);
//     };
//   };

//   const handleCropComplete = (croppedArea, croppedAreaPixels) => {
//     setCroppedArea(croppedAreaPixels);
//   };

//   const handleCropConfirm = async () => {
//     const croppedImage = await getCroppedImg(imageSrc, croppedArea);
//     setCroppedImage(croppedImage);
//     setFormData({ ...formData, photo: croppedImage });
//     setIsCropping(false);
//   };

//   const updateProfileHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       let updatedFormData = { ...formData };

//       if (croppedImage) {
//         const data = await uploadImageToCloudinary(croppedImage);
//         updatedFormData.photo = data?.url;
//       }

//       const res = await fetch(`${BASE_URL}/doctors/${doctorData._id}`, {
//         method: 'PUT',
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(updatedFormData)
//       });

//       const result = await res.json();
//       if (!res.ok) {
//         throw Error(result.message);
//       }

//       setLoading(false);
//       setProfileUpdateSuccess(true);
//       toast.success(result.message);
//     } catch (err) {
//       setLoading(false);
//       toast.error(err.message);
//     }
//   };

//   // Reusable function for adding item
//   const addItem = (key, item) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [key]: [...prevFormData[key], item],
//     }));
//   };

//   // Reusable input change function
//   const handleReusableInputChangeFunc = (key, index, event) => {
//     const { name, value } = event.target;
//     setFormData((prevFormData) => {
//       const updateItems = [...prevFormData[key]];
//       updateItems[index][name] = value;

//       return {
//         ...prevFormData,
//         [key]: updateItems,
//       };
//     });
//   };

//   // Reusable function for deleting item
//   const deleteItem = (key, index) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [key]: prevFormData[key].filter((_, i) => i !== index),
//     }));
//   };

//   const addQualification = (e) => {
//     e.preventDefault();

//     addItem("qualifications", {
//       startingDate: "",
//       endingDate: "",
//       degree: "",
//       university: "",
//     });
//   };
//   const handleQualificationChange = (event, index) => {
//     handleReusableInputChangeFunc("qualifications", index, event);
//   };
//   const deleteQualification = (e, index) => {
//     e.preventDefault();
//     deleteItem("qualifications", index);
//   };

//   const addExperience = (e) => {
//     e.preventDefault();

//     addItem("experiences", {
//       startingDate: "",
//       endingDate: "",
//       position: "",
//       hospital: "",
//     });
//   };
//   const handleExperienceChange = (event, index) => {
//     handleReusableInputChangeFunc("experiences", index, event);
//   };
//   const deleteExperience = (e, index) => {
//     e.preventDefault();
//     deleteItem("experiences", index);
//   };

//   const addTimeSlot = (e) => {
//     e.preventDefault();

//     addItem("timeSlots", {
//       day: "",
//       startingTime: "",
//       endingTime: "",
//     });
//   };
//   const handleTimeSlotChange = (event, index) => {
//     handleReusableInputChangeFunc("timeSlots", index, event);
//   };
//   const deleteTimeSlot = (e, index) => {
//     e.preventDefault();
//     deleteItem("timeSlots", index);
//   };

//   return (
//     <div>
//       <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
//         Profile Information
//       </h2>

//       <form>
//         {/*--------- This is for the Name Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Name*</p>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             placeholder="Full Name"
//             className="form__input"
//           />
//         </div>

//         {/*--------- This is for the Email Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Email Address*</p>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="Email"
//             className="form__input"
//             readOnly
//             aria-readonly
//             disabled
//           />
//         </div>

//         {/*--------- This is for the Phone number Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Phone*</p>
//           <input
//             type="number"
//             name="phone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             placeholder="Phone"
//             className="form__input"
//           />
//         </div>

//         {/*--------- This is for the Bio Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Bio*</p>
//           <input
//             type="text"
//             name="bio"
//             value={formData.bio}
//             onChange={handleInputChange}
//             placeholder="Bio"
//             className="form__input"
//           />
//         </div>

//         {/*--------- This is for the Gender Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Gender*</p>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleInputChange}
//             className="form__select"
//           >
//             <option value="" disabled>
//               Select Gender
//             </option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         {/*--------- This is for the Specialization Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Specialization*</p>
//           <input
//             type="text"
//             name="specialization"
//             value={formData.specialization}
//             onChange={handleInputChange}
//             placeholder="Specialization"
//             className="form__input"
//           />
//         </div>

//         {/*--------- This is for the Ticket Price Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Ticket Price*</p>
//           <input
//             type="number"
//             name="ticketPrice"
//             value={formData.ticketPrice}
//             onChange={handleInputChange}
//             placeholder="Ticket Price"
//             className="form__input"
//           />
//         </div>

//         {/*--------- This is for the About Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">About*</p>
//           <textarea
//             name="about"
//             value={formData.about}
//             onChange={handleInputChange}
//             placeholder="About"
//             className="form__textarea"
//           />
//         </div>

//         {/*--------- This is for the Address Input ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Address Line 1*</p>
//           <input
//             type="text"
//             name="address.line1"
//             value={formData.address.line1}
//             onChange={handleInputChange}
//             placeholder="Address Line 1"
//             className="form__input"
//           />
//         </div>

//         <div className="mb-5">
//           <p className="form__label">Address Line 2</p>
//           <input
//             type="text"
//             name="address.line2"
//             value={formData.address.line2}
//             onChange={handleInputChange}
//             placeholder="Address Line 2"
//             className="form__input"
//           />
//         </div>

//         <h6>Country</h6>
//       <CountrySelect
//         onChange={handleCountryChange}
//         placeHolder="Select Country"
//       />

//       <h6>State</h6>
//       <StateSelect
//         countryid={countryid}
//         onChange={handleStateChange}
//         placeHolder="Select State"
//       />

//       <h6>City</h6>
//       <CitySelect
//         countryid={countryid}
//         stateid={stateid}
//         onChange={handleCityChange}
//         placeHolder="Select City"
//       />

//         <div className="mb-5">
//           <p className="form__label">Pincode*</p>
//           <input
//             type="text"
//             name="address.pincode"
//             value={formData.address.pincode}
//             onChange={handleInputChange}
//             placeholder="Pincode"
//             className="form__input"
//           />
//         </div>

//         {/*--------- This is for the Qualifications Section ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Qualifications</p>
//           {formData.qualifications.map((qualification, index) => (
//             <div key={index} className="qualification__section">
//               <input
//                 type="date"
//                 name="startingDate"
//                 value={qualification.startingDate}
//                 onChange={(event) => handleQualificationChange(event, index)}
//                 className="form__input"
//               />
//               <input
//                 type="date"
//                 name="endingDate"
//                 value={qualification.endingDate}
//                 onChange={(event) => handleQualificationChange(event, index)}
//                 className="form__input"
//               />
//               <input
//                 type="text"
//                 name="degree"
//                 value={qualification.degree}
//                 onChange={(event) => handleQualificationChange(event, index)}
//                 placeholder="Degree"
//                 className="form__input"
//               />
//               <input
//                 type="text"
//                 name="university"
//                 value={qualification.university}
//                 onChange={(event) => handleQualificationChange(event, index)}
//                 placeholder="University"
//                 className="form__input"
//               />
//               <IconButton
//                 color="secondary"
//                 onClick={(e) => deleteQualification(e, index)}
//               >
//                 <MdDelete />
//               </IconButton>
//             </div>
//           ))}
//           <button className="btn" onClick={addQualification}>
//             Add Qualification
//           </button>
//         </div>

//         {/*--------- This is for the Experiences Section ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Experiences</p>
//           {formData.experiences.map((experience, index) => (
//             <div key={index} className="experience__section">
//               <input
//                 type="date"
//                 name="startingDate"
//                 value={experience.startingDate}
//                 onChange={(event) => handleExperienceChange(event, index)}
//                 className="form__input"
//               />
//               <input
//                 type="date"
//                 name="endingDate"
//                 value={experience.endingDate}
//                 onChange={(event) => handleExperienceChange(event, index)}
//                 className="form__input"
//               />
//               <input
//                 type="text"
//                 name="position"
//                 value={experience.position}
//                 onChange={(event) => handleExperienceChange(event, index)}
//                 placeholder="Position"
//                 className="form__input"
//               />
//               <input
//                 type="text"
//                 name="hospital"
//                 value={experience.hospital}
//                 onChange={(event) => handleExperienceChange(event, index)}
//                 placeholder="Hospital"
//                 className="form__input"
//               />
//               <IconButton
//                 color="secondary"
//                 onClick={(e) => deleteExperience(e, index)}
//               >
//                 <MdDelete />
//               </IconButton>
//             </div>
//           ))}
//           <button className="btn" onClick={addExperience}>
//             Add Experience
//           </button>
//         </div>

//         {/*--------- This is for the Time Slots Section ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Available Time Slots</p>
//           {formData.timeSlots.map((timeSlot, index) => (
//             <div key={index} className="timeslot__section">
//               <input
//                 type="text"
//                 name="day"
//                 value={timeSlot.day}
//                 onChange={(event) => handleTimeSlotChange(event, index)}
//                 placeholder="Day"
//                 className="form__input"
//               />
//               <input
//                 type="time"
//                 name="startingTime"
//                 value={timeSlot.startingTime}
//                 onChange={(event) => handleTimeSlotChange(event, index)}
//                 className="form__input"
//               />
//               <input
//                 type="time"
//                 name="endingTime"
//                 value={timeSlot.endingTime}
//                 onChange={(event) => handleTimeSlotChange(event, index)}
//                 className="form__input"
//               />
//               <IconButton
//                 color="secondary"
//                 onClick={(e) => deleteTimeSlot(e, index)}
//               >
//                 <MdDelete />
//               </IconButton>
//             </div>
//           ))}
//           <button className="btn" onClick={addTimeSlot}>
//             Add Time Slot
//           </button>
//         </div>

//         {/*--------- This is for the Profile Image Section ----------- */}
//         <div className="mb-5">
//           <p className="form__label">Profile Image</p>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileInputChange}
//             className="form__input"
//           />
//           {isCropping && (
//             <div className="crop-container">
//               <Cropper
//                 image={imageSrc}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={handleCropComplete}
//               />
//               <button onClick={handleCropConfirm} className="btn">
//                 Confirm Crop
//               </button>
//             </div>
//           )}
//           {croppedImage && (
//             <div className="image-preview">
//               <img src={croppedImage} alt="Cropped" />
//               <IconButton
//                 color="secondary"
//                 onClick={() => setCroppedImage(null)}
//               >
//                 <MdDelete />
//               </IconButton>
//             </div>
//           )}
//         </div>

//         <button className="btn" onClick={updateProfileHandler} disabled={loading}>
//           {loading ? "Updating..." : "Update Profile"}
//         </button>

//         {profileUpdateSuccess && (
//           <div className="success-message">
//             <FaCheckCircle />
//             <span>Profile Updated Successfully!</span>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Profile;
