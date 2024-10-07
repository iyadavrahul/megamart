const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name_ar: {
      type: String,
      required: true,
    },
    name_en: {
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
  { collection: "SubCategory" }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
