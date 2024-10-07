const mongoose = require("mongoose");

const values = new mongoose.Schema({
  name_en: {
    type: String,
    require: true,
  },
  name_ar: {
    type: String,
    require:true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attributes",
    required: true,
  },
},
{ timestamps: true },
{ collection: "Value" }
);
const Values = mongoose.model("Value", values);

module.exports = Values;
