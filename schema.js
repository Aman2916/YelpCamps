const JOI = require("joi");
module.exports.campgroundSchema = JOI.object({
  campground: JOI.object({
    title: JOI.string().required(),
    location: JOI.string().required(),
    price: JOI.number().required().min(0),
    description: JOI.string().required(),
    image: JOI.string().required(),
  }).required(),
});

module.exports.reviewSchema = JOI.object({
  review: JOI.object({
    rating: JOI.number().required(),
    body: JOI.string().required(),
  }).required(),
});
