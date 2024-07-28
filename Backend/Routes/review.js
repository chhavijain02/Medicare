// import express from 'express'
// import { getAllReviews, createReview } from '../Controllers/reviewController.js'
// import { authenticate, restrict } from '../auth/verifyToken.js'

// const router = express.Router({mergeParams: true});

// router.route('/').get(getAllReviews).post(authenticate,restrict(['patient']), createReview);
// export default router;


// import express from 'express';
// import Review from '../models/ReviewSchema.js';
// import { authenticate, restrict } from '../auth/verifyToken.js';
// import { io } from '../index.js';
// import { getAllReviews, createReview } from '../Controllers/reviewController.js'

// const router = express.Router({ mergeParams: true });

// router.route('/')
//   .get(getAllReviews)
//   .post(authenticate, restrict(['patient']), createReview);

// router.post('/', authenticate, restrict(['patient']), async (req, res) => {
//   const { rating, reviewText } = req.body;
//   const { doctorId } = req.params;

//   try {
//     const newReview = new Review({
//       doctor: doctorId,
//       rating,
//       reviewText,
//       user: req.userId
//     });
//     await newReview.save();

//     const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name photo'); // Populate user details
//     io.emit('updateReviews', reviews);

//     res.status(201).json({ success: true, message: 'Review added successfully', data: reviews });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.get('/', async (req, res) => {
//   console.log("getting reviews");
//   const { doctorId } = req.params;

//   try {
//     const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name photo');
//     res.status(200).json({ success: true, data: reviews });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


// export default router;


// reviewRouter.js

import express from 'express';
import Review from '../models/ReviewSchema.js';
import { authenticate, restrict } from '../auth/verifyToken.js';
import { getAllReviews, createReview } from '../Controllers/reviewController.js';
import { io } from '../index.js';

const router = express.Router({ mergeParams: true });

// Route to get all reviews
router.route('/all')
  .get(getAllReviews);

// Route to get reviews for a specific doctor
router.get('/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    console.log("Fetching reviews for doctor:", doctorId);
    const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name photo');
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Route to create a new review
router.post('/:doctorId', authenticate, restrict(['patient']), async (req, res) => {
  console.log("I am fine");
  const { rating, reviewText } = req.body;
  const { doctorId } = req.params;

  try {
    const newReview = new Review({
      doctor: doctorId,
      rating,
      reviewText,
      user: req.userId
    });
    await newReview.save();

    const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name photo');
    io.emit('updateReviews', reviews);

    res.status(201).json({ success: true, message: 'Review added successfully', data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;




