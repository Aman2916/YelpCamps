const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  image: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Campground", CampgroundSchema);
