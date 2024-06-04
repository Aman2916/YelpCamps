const JOI = require("joi");
const campgroundSchema = JOI.object({
  campground: JOI.object({
    title: JOI.string().required(),
    location: JOI.string().required(),
    price: JOI.number().required().min(0),
    description: JOI.string().required(),
    image: JOI.string().required(),
  }).required(),
});
module.exports = campgroundSchema;
