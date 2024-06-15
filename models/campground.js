const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };
const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_250");
});

const CampgroundSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    description: String,
    images: [imageSchema],
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<p><a href="/campgrounds/${this._id}">${this.title}</a></p>
          <p>${this.description.substring(0, 50)}...</p>
           <img src="${
             this.images[0].thumbnail
           }" style="max-height:70px;display:center"/>`;
});

module.exports = mongoose.model("Campground", CampgroundSchema);
