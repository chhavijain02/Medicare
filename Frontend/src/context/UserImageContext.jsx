// import React, { createContext, useContext, useState } from 'react';

// const UserImageContext = createContext();

// export const useUserImageContext = () => useContext(UserImageContext);

// export const UserImageProvider = ({ children }) => {
//   const [profilePhoto, setProfilePhoto] = useState(null);

  // const updateProfilePhoto = (newPhotoUrl) => {
  //   setProfilePhoto(newPhotoUrl);
  // };

//   return (
//     <UserImageContext.Provider value={{ profilePhoto, updateProfilePhoto }}>
//       {children}
//     </UserImageContext.Provider>
//   );
// };


// UserImageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserImageContext = createContext();

export const useUserImageContext = () => useContext(UserImageContext);

export const UserImageProvider = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const updateProfilePhoto = (newPhotoUrl) => {
    setProfilePhoto(newPhotoUrl);
  };
  
  const fetchProfilePhoto = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/doctors/profile/me');
      const data = await response.json();
      setProfilePhoto(data.photo); 
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
  };

  useEffect(() => {
    if (profilePhoto === null) {
      fetchProfilePhoto();
    }
  }, [profilePhoto]);

  return (
    <UserImageContext.Provider value={{ profilePhoto, updateProfilePhoto }}>
      {children}
    </UserImageContext.Provider>
  );
};

export default UserImageContext;
