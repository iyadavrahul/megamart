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
    ref: "category",
    require: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory",
    require: true,
  },
  subSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subSubCategory",
    require: true,
  },
},
{ timestamps: true },
{ collection: "attributes" }

);
const Attribute = mongoose.model("attributes", attribute);

module.exports = Attribute;
