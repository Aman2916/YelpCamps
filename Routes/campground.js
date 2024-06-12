const express = require("express");
const router = express.Router();
const campground = require("../controller/campground");
const catchAsync = require("../utilities/errorAsync.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");

//index page shows all available Campgrounds
router.get("/", catchAsync(campground.index));

//form to add a new camp
router.get("/new", isLoggedIn, campground.renderNewForm);

//whenever a form is submitted add camp , redirects to show page

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(campground.newFormToCreateCampground)
);

// shows single title + location using id
router.get("/:id", catchAsync(campground.showCampgroundById));

// edit campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campground.renderEditCampground)
);

//fake update use post
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(campground.editCampgroundForm)
);

//fake delete use post
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campground.deleteCampground)
);

module.exports = router;
