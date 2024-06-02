const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

//whenever a form is submitted add camp , redirects to show
app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// shows single title + location using id
app.get("/campgrounds/:id", async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id);
  res.render("./campground/show.ejs", { campgrounds });
});

// edit campgrounds
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id);
  res.render("./campground/edit.ejs", { campgrounds });
});

//fake put use post
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campgrounds._id}`);
});
//fake delete use post
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
