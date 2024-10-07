const mongoose = require("mongoose");

const attribute = new mongoose.Schema({
  name_en: {
    type: String,
    require: true,
  },
  name_ar: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    require: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    require: true,
  },
  subSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSubCategory",
    require: true,
  },
},
{ timestamps: true },
{ collection: "Attributes" }

);
const Attribute = mongoose.model("Attributes", attribute);

module.exports = Attribute;
