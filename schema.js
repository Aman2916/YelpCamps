const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const JOI = BaseJoi.extend(extension);

module.exports.campgroundSchema = JOI.object({
  campground: JOI.object({
    title: JOI.string().required().escapeHTML(),
    location: JOI.string().required().escapeHTML(),
    price: JOI.number().required().min(0),
    description: JOI.string().required().escapeHTML(),
    //image: JOI.string().required(),
  }).required(),
  deleteImages: JOI.array(),
});

module.exports.reviewSchema = JOI.object({
  review: JOI.object({
    rating: JOI.number().required(),
    body: JOI.string().required().escapeHTML(),
  }).required(),
});
