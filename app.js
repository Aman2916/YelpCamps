const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilities/errorAsync.js");
const ExpressError = require("./utilities/errorExpress");
const JOI = require("joi");
const { join } = require("path");

mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
/*.then(()=>console.log("database connected"))
.catch(err=>{
console.log("Error")
console.log(err)
})
*/
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//index page shows all available Campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
});

//form to add a new camp
app.get("/campgrounds/new", (req, res) => {
  res.render("./campground/new");
});

//whenever a form is submitted add camp , redirects to show page
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    /*if (!req.body.campground) {
      throw new ExpressError(400, "Invalid Data");
    }*/
    const campgroundSchema = JOI.object({
      campground: JOI.object({
        title: JOI.string().required(),
        location: JOI.string().required(),
        price: JOI.number().required(),
        description: JOI.string().required(),
        image: JOI.string().required(),
      }).required(),
    });
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((e) => e.message).join(",");
      throw new ExpressError(error.details, 300);
    } else {
      const campground = new Campground(req.body.campground);
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}`);
    }
  })
);

// shows single title + location using id
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render("./campground/show.ejs", { campgrounds });
  })
);

// edit campgrounds
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render("./campground/edit.ejs", { campgrounds });
  })
);

//fake put use post
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campgrounds._id}`);
  })
);
//fake delete use post
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
  res.send("404 Page Not Found");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong :(";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
