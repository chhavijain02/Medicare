// const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
// const cloud_name = import.meta.env.VITE_CLOUD_NAME;

// const uploadImageToCloudinary = async (file, publicId) => {
//     const uploadData = new FormData();
//     uploadData.append('file', file);
//     uploadData.append('upload_preset', upload_preset);
//     uploadData.append('public_id', publicId);
//     uploadData.append('invalidate', true); // Add this line to invalidate the existing image

//     const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
//         method: 'POST',
//         body: uploadData,
//     });

//     const data = await res.json();
//     return data;
// };

// Example uploadImageToCloudinary function


// const uploadImageToCloudinary = async (imageFile) => {
//     const formData = new FormData();
//     formData.append("file", imageFile);
//     formData.append("upload_preset", upload_preset); // Replace with your Cloudinary upload preset
  
//     try {
//       const response = await fetch(
//         "https://api.cloudinary.com/v1_1/dl8wacf7h/image/upload",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
      
//       if (!response.ok) {
//         throw new Error("Failed to upload image");
//       }
  
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Error uploading image to Cloudinary:", error);
//       throw error;
//     }
//   };
  

// export default uploadImageToCloudinary;

import { toast } from 'react-toastify';
import { CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } from '../config'; // Update with your Cloudinary details

const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Replace with your upload preset

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        toast.error('Error uploading image');
        return null;
    }
};

export default uploadImageToCloudinary;

