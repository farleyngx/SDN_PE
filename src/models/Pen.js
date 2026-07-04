const mongoose = require("mongoose");

const penSchema = new mongoose.Schema(
  {
    penName: { type: String, required: true, unique: true },
    penDescription: { type: String, required: true },
    image: { type: String, required: true },
    pouch: { type: Boolean, default: false },
    off: { type: Number, required: true },
    gender: { type: Boolean, default: false },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Pen", penSchema, "pens");
