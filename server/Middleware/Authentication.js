const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/register-model");
module.exports = async function (req, res, next) {
  console.log("Cookies", req.cookies);
  if (!req.cookies?.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    let decode = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decode.email })
      .select("-password");
    req.user = user;
    next();
  } catch (err) {
    console.log(err, "message");
    res.redirect("/");
  }
};
