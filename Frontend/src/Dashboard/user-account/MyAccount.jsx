import React, { useContext, useState } from "react";
import { authContext } from "./../../context/authContext.jsx";
import MyBookings from "./MyBookings.jsx";
import Profile from "./Profile.jsx";
import useFetchData from "../../hooks/useFetchData.jsx";
import { BASE_URL } from "../../config.js";
import Loading from "../../components/Loader/Loading.jsx";
import Error from "../../components/Error/Error.jsx";

const MyAccount = () => {
  const { dispatch } = useContext(authContext);
  const [tab, setTab] = useState("bookings");

  const { data: userData, loading, error } = useFetchData(`${BASE_URL}/users/profile/me`);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loading />}
        {error && !loading && <Error errorMessage={error} />}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-[#53b6ca]">
                  <img
                    src={userData.photo}
                    alt="Profile Picture"
                    className="w-full h-full rounded-full"
                  />
                </figure>
              </div>

              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingsColor font-bold">
                  {userData.name}
                </h3>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  {userData.email}
                </p>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  Blood Type:{" "}
                  <span className="ml-2 text-headingsColor text-[22px] leading-8">
                    {userData.bloodType}
                  </span>
                </p>
              </div>

              <div className="mt-[50px] md:mt-[100px]">
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
                >
                  Logout
                </button>
                <button className="w-full bg-red-500 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
                  Delete Account
                </button>
              </div>
            </div>

            <div className="md:col-span-2 md:px-[30px] ">
              <div className="flex justify-center md:justify-evenly mb-10">
                <button
                  onClick={() => setTab("bookings")}
                  className={`${
                    tab === "bookings" ? "bg-[#53b6ca] text-white font-normal" : ""
                  } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-[#53b6ca]`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => setTab("settings")}
                  className={`${
                    tab === "settings" ? "bg-[#53b6ca] text-white font-normal" : ""
                  } py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-[#53b6ca]`}
                >
                  Profile Settings
                </button>
              </div>

              {tab === "bookings" && <MyBookings />}
              {tab === "settings" && <Profile user={userData}/>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAccount;
