const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    attributes: {
      type: [Types.ObjectId],
      ref: "Attribute",
      required: true,
    },
    values: {
      type: Types.ObjectId,
      ref: "Value",
      required: false,
    },
    imagesApp: {
      type: Array,
      default: [],
    },
    imagesWeb: {
      type: Array,
      default: [],
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { collection: "Varient" },
);

const Varient = model("Varient", schema);

module.exports = Varient;
