const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const UserRouter = require("./UserRouter");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", UserRouter);
try {
  mongoose.connect("mongodb://localhost:27017/Parking_system", {});
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
