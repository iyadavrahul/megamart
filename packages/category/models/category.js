const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: true,
    },
    name_ar: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    description_en: {
      type: String,
      required: true,
    },
    description_ar: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
  { collection: "category" }
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
