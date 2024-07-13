import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import { authContext } from "../context/authContext.jsx";
import { FaCheckCircle } from "react-icons/fa";
import "../Login.css"; // Create this CSS file for custom styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.data,
          token: result.token,
          role: result.role,
        },
      });

      console.log(result, "login data");

      setLoading(false);
      setLoginSuccess(true);
      toast.success(result.message);
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-primaryColor">Welcome</span> Back 🎉
        </h3>
        <form className="py-4 md:py-0" onSubmit={submitHandler}>
          <div className="mb-5">
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border-solid border-[#006ff61] focus:outline-none focus:border-b-primaryColor text-[18px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border-solid border-[#006ff61] focus:outline-none focus:border-b-primaryColor text-[18px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              required
            />
          </div>
          <div className="mt-7">
          <button
              type="submit"
              className={`w-full text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 transition-all duration-300 ${
                loading || loginSuccess
                  ? "bg-gradient-to-r from-[#005EEB] to-[#69E6FF]"
                  : "bg-gradient-to-r from-primaryColor to-[#AEC7EB]"
              } flex justify-center items-center`}
              disabled={loading || loginSuccess}
            >
              {loginSuccess ? (
                <FaCheckCircle size={25} color="#fff" />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <p className="mt-5 text-textColor text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primaryColor font-medium ">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
