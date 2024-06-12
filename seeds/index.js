const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp")
  .then(() => console.log("database connected"))
  .catch((err) => {
    console.log("Error");
    console.log(err);
  });

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]; //sample(arr) is a function takes array as an argument

const seedDb = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 150; i++) {
    const random100 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "66631a6fae22068098604ad2",
      location: `${cities[random100].city},${cities[random100].state}`,
      title: `${sample(descriptors)}${sample(places)}`,
      images: {
        url: "https://res.cloudinary.com/dv801otku/image/upload/v1717921795/YelpCamp/hzolf7mbreidyzxmvgdd.jpg",
        filename: "YelpCamp/hzolf7mbreidyzxmvgdd",
      },
      description:
        "Some Random Generated Cities along with their famously populated Camps!!!!!!",
      price: `${price}`,
      geometry: {
        type: "Point",
        coordinates: [cities[random100].longitude, cities[random100].latitude],
      },
    });
    await camp.save();
  }
};
seedDb().then(() => mongoose.connection.close());
