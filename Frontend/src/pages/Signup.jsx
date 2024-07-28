import { useState, useCallback } from "react";
import SignupImg from "../assets/images/signup.gif";
import { Link, useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import { FaCheck } from "react-icons/fa";
import "../Login.css";

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [croppedArea, setCroppedArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
    gender: "",
    role: "patient",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const imageDataUrl = URL.createObjectURL(file);
    setPreviewURL(imageDataUrl);
    setSelectedFile(file);
    setCropping(true);
  };

  const handleCropComplete = useCallback(
    (croppedAreaPercentage, croppedAreaPixels) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(previewURL, croppedArea);
      setPreviewURL(URL.createObjectURL(croppedImage));
      const data = await uploadImageToCloudinary(croppedImage);
      setFormData({ ...formData, photo: data.url });
      setCropping(false);
    } catch (err) {
      console.error(err);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!formData.photo) {
      toast.error("Please upload a photo");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      setSignupSuccess(true);
      toast.success(message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={SignupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Create an <span className="text-primaryColor"> Account</span>
            </h3>

            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
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
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor=""
                  className="text-textColor font-bold text-[16px] leading-7"
                >
                  Are you a:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>

                <label className="text-textColor font-bold text-[16px] leading-7">
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex items-center gap-3">
                {previewURL && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                    <img
                      src={previewURL}
                      alt=""
                      className="w-full rounded-full"
                    />
                  </figure>
                )}

                <div className="relative w-[130px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleFileInputChange}
                    accept=".jpg, .png, .jpeg"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              {cropping && (
                <div className="crop-container relative mb-5">
                  <Cropper
                    image={previewURL}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                    className="rounded-lg overflow-hidden"
                  />
                  <button
                    onClick={handleCrop}
                    className="absolute bottom-4 right-4 bg-blue-500 rounded-full p-2 text-white flex items-center justify-center"
                  >
                    <FaCheck />
                  </button>
                </div>
              )}

              <div className="mt-6 lg:mt-8">
                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 transition-all duration-300 ${
                    loading || signupSuccess
                      ? "bg-gradient-to-r from-[#005EEB] to-[#69E6FF]"
                      : "bg-gradient-to-r from-primaryColor to-[#AEC7EB]"
                  } flex justify-center items-center`}
                >
                  {signupSuccess ? (
                    <FaCheckCircle size={25} color="#fff" />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>

              <p className="mt-5 text-textColor text-center">
                Already have an account?
                <Link
                  to="/login"
                  className="text-primaryColor font-medium ml-1"
                >
                  {" "}
                  Login{" "}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;