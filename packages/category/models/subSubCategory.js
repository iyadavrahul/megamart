const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
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
  { collection: "SubSubCategory" }
);

const SubSubCategory = mongoose.model("SubSubCategory", schema);

module.exports = SubSubCategory;
