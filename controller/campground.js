const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const token = process.env.MAPBOX_ACCESS_TOKEN;
const geocoder = mbxGeocoding({ accessToken: token });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./campground/new");
};

module.exports.newFormToCreateCampground = async (req, res, next) => {
  console.log(req.body);
  try {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();

    const campground = new Campground(req.body.campground);
    campground.geometry = {
      type: "Point",
      coordinates: geoData.body.features[0].geometry.coordinates,
    };
    console.log(geoData.body.features[0].geometry.coordinates);
    console.log(campground.geometry.coordinates);
    campground.images = req.files.map((e) => ({
      url: e.path,
      filename: e.filename,
    }));

    campground.author = req.user._id;

    await campground.save();
    req.flash("success", "Successfully Created Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.showCampgroundById = async (req, res, next) => {
  const campgrounds = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  console.log(campgrounds);
  if (!campgrounds) {
    req.flash("error", "Cannot find Campground");
    return res.redirect("/campgrounds");
  }
  res.render("./campground/show.ejs", { campgrounds });
};

module.exports.renderEditCampground = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find Campground");
    return res.redirect("/campgrounds");
  }
  const campgrounds = await Campground.findById(req.params.id);
  res.render("./campground/edit.ejs", { campgrounds });
};

module.exports.editCampgroundForm = async (req, res, next) => {
  const { id } = req.params;
  const campgrounds = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const img = req.files.map((e) => ({
    url: e.path,
    filename: e.filename,
  }));
  campgrounds.images.push(...img);
  await campgrounds.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campgrounds.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Updated Campground");
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
};
