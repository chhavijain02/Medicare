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
  const { rating, reviewText } = req.body;
  const { doctorId } = req.params;

  try {
    // Check if user already has a review for this doctor
    const existingReview = await Review.findOne({ doctor: doctorId, user: req.userId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this doctor. Please edit your existing review.' });
    }

    const newReview = new Review({
      doctor: doctorId,
      rating,
      reviewText,
      user: req.userId
    });
    await newReview.save();

    const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name photo');
    io.emit('updateReviews', { doctorId, reviews });

    res.status(201).json({ success: true, message: 'Review added successfully', data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Route to update an existing review
router.put('/:doctorId/:reviewId', authenticate, restrict(['patient']), async (req, res) => {
  const { rating, reviewText } = req.body;
  const { doctorId, reviewId } = req.params;

  try {
    console.log('=== UPDATE REVIEW DEBUG ===');
    console.log('Authenticated userId:', req.userId);
    console.log('Review ID:', reviewId);

    // Use skipPopulate option to get raw ObjectId
    const review = await Review.findOne({ _id: reviewId }).setOptions({ skipPopulate: true }).lean();
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    console.log('Review user field type:', typeof review.user);
    console.log('Review user value:', review.user);

    // Ensure the user owns this review
    if (String(review.user) !== String(req.userId)) {
      console.log('❌ User mismatch!');
      console.log('  Review user ID:', String(review.user));
      console.log('  Request user ID:', String(req.userId));
      return res.status(403).json({ success: false, message: 'You can only edit your own review' });
    }

    console.log('✅ User match - proceeding with update');

    // Update the review
    await Review.findByIdAndUpdate(reviewId, { rating, reviewText });

    const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name photo');
    io.emit('updateReviews', { doctorId, reviews });

    res.status(200).json({ success: true, message: 'Review updated successfully', data: reviews });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Route to delete a review
router.delete('/:doctorId/:reviewId', authenticate, restrict(['patient']), async (req, res) => {
  const { doctorId, reviewId } = req.params;

  try {
    console.log('=== DELETE REVIEW DEBUG ===');
    console.log('Authenticated userId:', req.userId);
    console.log('Review ID:', reviewId);

    // Use skipPopulate option to get raw ObjectId
    const review = await Review.findOne({ _id: reviewId }).setOptions({ skipPopulate: true }).lean();
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    console.log('Review user:', review.user);
    console.log('Request userId:', req.userId);

    // Ensure the user owns this review
    if (String(review.user) !== String(req.userId)) {
      console.log('❌ User mismatch!');
      return res.status(403).json({ success: false, message: 'You can only delete your own review' });
    }

    console.log('✅ User match - proceeding with delete');

    await Review.findByIdAndDelete(reviewId);

    const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name photo');
    io.emit('updateReviews', { doctorId, reviews });

    res.status(200).json({ success: true, message: 'Review deleted successfully', data: reviews });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;




