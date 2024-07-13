import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated",
        data: updatedDoctor,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id).populate('reviews').select("-password");
    res
      .status(200)
      .json({ success: true, message: "Doctor Found", data: doctor });
  } catch (err) {
    res.status(404).json({ success: false, message: "Doctor Not Found" });
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, specializations, city } = req.query;
    let doctors;

    const filter = { isApproved: "approved" };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
        { "address.city": { $regex: query, $options: "i" } }
      ];
    }

    if (minPrice && maxPrice) {
      filter.ticketPrice = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    if (specializations) {
      filter.specialization = { $in: specializations.split(",") };
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    doctors = await Doctor.find(filter).select("-password");

    res.status(200).json({ success: true, message: "Doctors Found", data: doctors });
  } catch (err) {
    res.status(404).json({ success: false, message: "Doctors Not Found", error: err.message });
  }
};





// export const getAllDoctor = async (req, res) => {
//   try {
//     const {query}= req.query
//     let doctors;

//     if(query){
//         doctors=await Doctor.find({
//             isApproved:"approved", 
//             $or:[
//                 {name:{ $regex:query, $options:"i"}},
//                 {specialization: {$regex:query, $options:"i"}},
//             ]
//         }).select("-password");
//     }else{
//         doctors = await Doctor.find({isApproved:"approved"}).select("-password");
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "Doctors Found", data: doctors });
//   } catch (err) {
//     res.status(404).json({ success: false, message: "Doctors Not Found" });
//   }
// };

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Destructure to exclude the password
    const { password, ...rest } = doctor._doc;

    // Fetch appointments for the doctor
    const appointments = await Booking.find({ doctor: doctorId });

    // Send the response with the doctor's profile and appointments
    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong, cannot get" });
    console.log(err.message);
  }
};

