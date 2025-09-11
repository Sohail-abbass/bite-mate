const express = require("express");
const {
  productCreateItems,
  productItemById,
  productShowPagination,
  likeProduct,
  dislike,
  striptPayment,
  commentApi,
  editPost,
  uploadImageOnly,
  deletePost,
} = require("../controller/product-controller");

const productRouter = express.Router();

productRouter.post("/", productCreateItems);
productRouter.get("/", productShowPagination);
productRouter.get("/:id", productItemById);
productRouter.post("/:id/like", likeProduct);
productRouter.post("/:id/dislike", dislike);
productRouter.post("/payment", striptPayment);
productRouter.post("/:id/comment", commentApi);
productRouter.put("/edit/:id", editPost);
productRouter.delete("/delete/:id", deletePost);
// productRouter.post("/upload", uploadImageOnly);

module.exports = productRouter;
