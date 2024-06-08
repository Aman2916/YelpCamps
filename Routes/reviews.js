const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/errorAsync.js");
const ExpressError = require("../utilities/errorExpress");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review");
const Campground = require("../models/campground.js");
const { isLoggedIn } = require("../middleware");
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 600);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Added your review.");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

module.exports = router;
