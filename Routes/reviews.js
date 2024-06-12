const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/errorAsync.js");
const review = require("../controller/review");

const { isLoggedIn, validateReview } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(review.createReview));

module.exports = router;
