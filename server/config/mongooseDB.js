const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`,  {family: 4}
    );
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;
