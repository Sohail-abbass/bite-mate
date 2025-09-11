const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    newPrice: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: false,
    },
    sale: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      time: new Date().toLocaleString(),
    },
    likes: [{ type: String }],
    comments: [{ type: String }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
