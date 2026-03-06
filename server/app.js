require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongooseDB");
const expressonSession = require("express-session");
const productRouter = require("./Routers/productModel");
const cookieParser = require("cookie-parser");
const authRouter = require("./Routers/AuthRouter");
const app = express();

connectDB().catch((err) => console.error("Database connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/upload", express.static("upload"));
app.use(cookieParser());

console.log("LOCAL_ORIGIN:::::::::", process.env.LOCAL_ORIGIN);

app.use(
  cors({
    origin: `${process.env.LOCAL_ORIGIN}`,
    credentials: true,
  })
);

app.use(
  expressonSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (res, req) => {
  req.send("Hello World");
});

app.use("/products", productRouter);
app.use("/", authRouter);

const PORT = 5000;
// app.listen(PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
