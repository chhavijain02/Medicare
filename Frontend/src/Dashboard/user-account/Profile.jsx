import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL, token } from "../../config";
import {toast} from 'react-toastify'
import Cropper from "react-easy-crop";
import { IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import getCroppedImg from "../../utils/cropImage";

const Profile = ({user}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [croppedArea, setCroppedArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [loading, setLoading] = useState(false);

  const[formData, setFormData] = useState({
    name:'',
    email:'',
    password:'',
    photo: null,
    gender:'',
    bloodType:"",
  })

  const navigate = useNavigate()

  useEffect(()=>{
    setFormData({ 
      name:user.name,
      email:user.email,
      photo:user.photo,
      gender:user.gender,
      bloodType:user.bloodType
    })
  },[user])

  const handleInputChange = e =>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const handleFileInputChange = async(event) =>{

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

  const updateProfileHandler = async event =>{
    event.preventDefault();
    setLoading(true);
    try {
        let updatedFormData = { ...formData };

        if (croppedImage) {
            const data = await uploadImageToCloudinary(croppedImage);
            updatedFormData.photo = data?.url;
        }

        const res = await fetch(`${BASE_URL}/users/${user._id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedFormData)
        });

        const result = await res.json();
        if (!res.ok) {
            throw Error(result.message);
        }

      setLoading(false);
      setProfileUpdateSuccess(true);
      toast.success(result.message);
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div className='mt-10'>
      <form onSubmit={updateProfileHandler}>
            <div className="mb-5">
              <input 
                type="text" 
                placeholder="Enter your full name"
                name="name" 
                value={formData.name}
                onChange={handleInputChange} 
                className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
                focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
                placeholder:text-textColor cursor-pointer"
                required
              />
            </div>

            <div className="mb-5">
              <input 
                type="email" 
                placeholder="Enter your email"
                name="email" 
                value={formData.email}
                onChange={handleInputChange}  
                className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
                focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
                placeholder:text-textColor cursor-pointer"
                aria-readonly
                readOnly
                disabled = "true"
              />
            </div>

            <div className="mb-5">
              <input 
                type="password" 
                placeholder="Enter new password"
                name="password" 
                value={formData.password}
                onChange={handleInputChange}  
                className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
                focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
                placeholder:text-textColor cursor-pointer"
              />
            </div>

            <div className="mb-5">
              <input 
                type="text" 
                placeholder="Blood Type"
                name="bloodType" 
                value={formData.bloodType}
                onChange={handleInputChange}  
                className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
                focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
                placeholder:text-textColor cursor-pointer"
                required
              />
            </div>

            <div className='mb-5 flex items-center justify-between'>
              <label className='text-textColor font-bold text-[16px] leading-7'>
                Gender: 
                <select 
                  name="gender" 
                  value={formData.gender}
                  onChange={handleInputChange} 
                  className='text-textColor font-semibold text-[15px] leading-7 px-4
                  py-3 focus:outline-none'
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female"> Female </option>
                  <option value="others"> Others </option>
                </select>
              </label>
            </div>


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
  )
}

export default Profile




































// import { useEffect, useState } from 'react'

// import { useNavigate } from 'react-router-dom';
// import uploadImageToCloudinary from '../../utils/uploadCloudinary';
// import { BASE_URL, token } from "../../config";
// import {toast} from 'react-toastify'
// import HashLoader from 'react-spinners/HashLoader'

// const Profile = (user) => {

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading ,setLoading] = useState(false)

//   const[formData, setFormData] = useState({
//     name:'',
//     email:'',
//     password:'',
//     photo: null,
//     gender:'',
//     bloodType: '',
//   })

//   const navigate = useNavigate()

//   useEffect(() => {
//     setFormData({
//       name: user.name,
//       email: user.email,
//       photo: user.photo,
//       gender: user.gender,
//       bloodType: user.bloodType
//     })
//   }, [user]);

//   const handleInputChange = e =>{
//     setFormData({...formData, [e.target.name]:e.target.value})
//   }

//   const handleFileInputChange = async(event) =>{

//     const file = event.target.files[0]

//     const data = await uploadImageToCloudinary(file);

//     setSelectedFile(data.url)
//     setFormData({... formData, photo: data.url})
//   };

//   const submitHandler = async event =>{
//     event.preventDefault()
//     setLoading(true)

//     try {
//       const res= await fetch(`${BASE_URL}/users/${user._id}` ,{
//         method : 'put',
//         headers:{
//           'Content-Type' : 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       })

//       const {message} = await res.json()

//       if(!res.ok){
//         throw new Error(message)
//       }

//       setLoading(false)
//       toast.success(message)
//       navigate('/users/profile/me')

//     } catch (err) {
//       toast.error(err.message)
//       setLoading(false)
//     }
//   };

//   return (
//     <div className='mt-10'>
//       <form onSubmit={submitHandler}>
//             <div className="mb-5">
//               <input 
//                 type="text" 
//                 placeholder="Enter your full name"
//                 name="name" 
//                 value={formData.name}
//                 onChange={handleInputChange} 
//                 className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
//                 focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
//                 placeholder:text-textColor cursor-pointer"
//                 required
//               />
//             </div>

//             <div className="mb-5">
//               <input 
//                 type="email" 
//                 placeholder="Enter your email"
//                 name="email" 
//                 value={formData.email}
//                 onChange={handleInputChange}  
//                 className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
//                 focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
//                 placeholder:text-textColor cursor-pointer"
//                 aria-readonly
//                 readOnly
//               />
//             </div>

//             <div className="mb-5">
//               <input 
//                 type="password" 
//                 placeholder="Enter new password"
//                 name="password" 
//                 value={formData.password}
//                 onChange={handleInputChange}  
//                 className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
//                 focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
//                 placeholder:text-textColor cursor-pointer"
//               />
//             </div>
//             <div className="mb-5">
//               <input 
//                 type="text" 
//                 placeholder="Blood Type"
//                 name="bloodType" 
//                 value={formData.bloodType}
//                 onChange={handleInputChange}  
//                 className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none
//                 focus:border-b-primaryColor text-[16px] leading-7 text-headingColor
//                 placeholder:text-textColor cursor-pointer"
//                 required
//               />
//             </div>

//             <div className='mb-5 flex items-center justify-between'>
//               <label className='text-textColor font-bold text-[16px] leading-7'>
//                 Gender: 
//                 <select 
//                   name="gender" 
//                   value={formData.gender}
//                   onChange={handleInputChange} 
//                   className='text-textColor font-semibold text-[15px] leading-7 px-4
//                   py-3 focus:outline-none'
//                 >
//                   <option value="">Select</option>
//                   <option value="male">Male</option>
//                   <option value="female"> Female </option>
//                   <option value="others"> Others </option>
//                 </select>
//               </label>
//             </div>

//             <div className='mb-5 flex items-center gap-3'>
//               { formData.photo && <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor
//               flex items-center justify-center'>
//                 <img src={formData.photo} alt="" className='w-full rounded-full'/>
//               </figure>}

//               <div className='relative w-[130px] h-[50px]'>
//                 <input 
//                   type="file" 
//                   name="photo"
//                   id="customFile"
//                   onChange={handleFileInputChange}
//                   accept=".jpg, .png, .jpeg"
//                   className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
//                 />

//                 <label htmlFor="customFile" className='absolute top-0 left-0 w-full h-full flex
//                 items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden
//                 bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'>
//                     {selectedFile ? selectedFile.name : "Upload photo"}
//                 </label>
//               </div>
//             </div>

//             <div className="mt-7">
//               <button 
//                disabled = {loading && true}
//                 type="submit"
//                 className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">

//               { loading ? (<HashLoader size ={25} color= "#ffffff" />
//               ) : (
//                 'Update'
//               )}
//               </button>
//              </div>
//       </form>
//     </div>
//   )
// }

// export default Profile