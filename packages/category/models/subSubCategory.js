const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategory: {
        type: mongoose.Types.ObjectId,
        ref: "subCategory",
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
  { collection: "subSubCategory" }
);

const SubSubCategory = mongoose.model("subSubCategory", schema);

module.exports = SubSubCategory;
