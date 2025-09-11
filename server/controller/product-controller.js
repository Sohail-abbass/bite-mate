const Product = require("../models/product-model");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const Authentication = require("../Middleware/Authentication");
require("dotenv").config();
const stripe = require("stripe")(process.env.SECERT_STRIPE_KEY);

const productShowPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy");
    const totalProducts = await Product.countDocuments();

    res.json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "upload";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const productCreateItems = [
  Authentication,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const {
        name,
        category,
        oldPrice,
        newPrice,
        colors,
        sale,
        ratings,
        description,
        ingredients,
        time,
        createdBy,
      } = req.body;

      const parsedColors = typeof colors === "string" ? JSON.parse(colors) : [];

      const productData = {
        name,
        category,
        oldPrice: parseFloat(oldPrice) || 0,
        newPrice: parseFloat(newPrice) || 0,
        colors: parsedColors,
        image: `/upload/${req.file.filename}`,
        sale: sale === "true" || sale === "on",
        ratings: parseFloat(ratings) || 0,
        description,
        ingredients,
        createdBy: req.user.id,
        time: new Date().toLocaleString(),
      };

      const product = new Product(productData);
      console.log("THE PRODUCT CREATED DATA IS ----- ", product);
      const savedProduct = await product.save();

      res.status(201).json({
        product: savedProduct,
        message: "Product is successfully created",
        status: 200,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).json({ message: err.message });
    }
  },
];

const productItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      product,
    });
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.likes.includes(username)) {
      return res.status(400).json({ message: "Already liked" });
    }

    product.likes.push(username);
    await product.save();

    res.json({
      message: "Product liked",
      likes: product.likes.length,
      likeBy: product.likes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const dislike = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.likes = product.likes.filter((user) => user !== username);
    await product.save();

    res.json({
      message: "Product disliked",
      likes: product.likes.length,
      likeBy: product.likes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const commentApi = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const product = await Product.findByIdAndUpdate(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.comments.push(comment);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: product.comments.length,
      commentBy: product.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const striptPayment = async (req, res) => {
  const { name, newPrice, email } = req.body;

  try {
    const product = await stripe.products.create({
      name,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: newPrice * 100,
      currency: "pkr",
    });
    console.log("price ", price);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      customer_email: email,
    });

    console.log("session ", session);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
};

const editPost = [
  upload.single("image"),

  async (req, res) => {
    try {
      const { id } = req.params;
      console.log("userId is ", id);

      const existing = await Product.findById(id);
      if (!existing) {
        return res.status(404).json({ message: "Product not found" });
      }

      const updateData = {
        name: req.body.name || existing.name,
        category: req.body.category || existing.category,
        oldPrice: req.body.oldPrice || existing.oldPrice,
        newPrice: req.body.newPrice || existing.newPrice,
        sale: req.body.sale === "true" || req.body.sale === true,
        ratings: req.body.ratings || existing.ratings,
        description: req.body.description || existing.description,
        ingredients: req.body.ingredients || existing.ingredients,
        createdBy: req.body.createdBy || existing.createdBy,
        image: req.file ? `/upload/${req.file.filename}` : existing.image,
      };

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Update Error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },
];

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      deletePost: product,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// const uploadImageOnly = [
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: "No image file provided" });
//       }

//       const imageUrl = `/upload/${req.file.filename}`;

//       res.status(200).json({
//         success: true,
//         message: "Image uploaded successfully",
//         imageUrl,
//       });
//     } catch (error) {
//       console.error("Image upload error:", error.message);
//       res.status(500).json({ message: "Server error", error });
//     }
//   },
// ];

module.exports = {
  productShowPagination,
  productCreateItems,
  productItemById,
  likeProduct,
  dislike,
  commentApi,
  striptPayment,
  editPost,
  deletePost,
  // uploadImageOnly,
  // upload,
};
