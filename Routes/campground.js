const express = require("express");
const router = express.Router();

const Campground = require("../models/campground.js");
const catchAsync = require("../utilities/errorAsync.js");
const ExpressError = require("../utilities/errorExpress");
const { campgroundSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const validateCampground = (req, res, next) => {
  console.log(req.body);
  const { error } = campgroundSchema.validate(req.body);
  console.log(error);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 300);
  } else {
    next();
  }
};
//index page shows all available Campgrounds
router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
});

//form to add a new camp
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./campground/new");
});

//whenever a form is submitted add camp , redirects to show page

router.post("/", validateCampground, isLoggedIn, async (req, res, next) => {
  /*if (!req.body.campground) {
        throw new ExpressError(400, "Invalid Data");
      }*/
  try {
    const campground = new Campground(req.body.campground);
    console.log(campground);
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash("success", "Successfully Created Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    next(err);
  }
});

// shows single title + location using id
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    console.log(campgrounds);
    if (!campgrounds) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campgrounds");
    }
    res.render("./campground/show.ejs", { campgrounds });
  })
);

// edit campgrounds
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render("./campground/edit.ejs", { campgrounds });
  })
);

//fake update use post
router.put(
  "/:id",
  validateCampground,
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that.");
      return res.redirect(`/campgrounds/${id}`);
    }
    const campgrounds = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Updated Campground");
    res.redirect(`/campgrounds/${campgrounds._id}`);
  })
);
//fake delete use post
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
