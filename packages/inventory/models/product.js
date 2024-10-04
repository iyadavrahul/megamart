const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: true,
    },
    name_ar: {
      type: String,
      required: true,
    },
    description_en: {
      type: String,
      required: false,
    },
    description_ar: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
      required: false,
    },
    subSubCategory: {
        type: mongoose.Types.ObjectId,
        ref: "subSubCategory",
        required: false,
      },
   
    status: {
      type: Boolean,
      required: false,
      default: false,
    },
   
  },
  { timestamps: true },
  { collection: "item" }
);

const Item = mongoose.model("item", itemSchema);

module.exports = Item;
