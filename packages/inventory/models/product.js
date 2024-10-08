const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: true,
    },
    name_ar: {
      type: String,
      default: "",
    },
    description_en: {
      type: String,
      required: false,
    },
    description_ar: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      required: false,
    },
    subSubCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubSubCategory",
      required: false,
    },
    imagesApp: {
      type: Array,
      required: false,
      default: [],
    },
    imagesWeb: {
      type: Array,
      required: false,
      default: [],
    },
    status: {
      type: Boolean,
      required: false,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    origin: {
      type: String,
      default: "",
    },
    hasVarients: {
      type: Boolean,
      default: false,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { collection: "Product" },
);

const Product = mongoose.model("Product", itemSchema);

module.exports = Product;
