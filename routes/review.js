const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");  // ✅ FIXED

const reviewcontroller= require("../controller/reviews.js");

// ---------------- DELETE REVIEW ----------------
router.delete(
  "/:reviewId",isLoggedIn,
  isAuthor,
  wrapAsync(reviewcontroller.destroyreview)
);


// ---------------- CREATE REVIEW ----------------
router.post(
  "/",isLoggedIn,
  validateReview,  // ✅ now it's a real function
  wrapAsync(reviewcontroller.createReview)
);

module.exports = router;
