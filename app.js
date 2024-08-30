require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const employeeRoute = require("./routes/employeeRoutes");

const app = express();
const BASE_URL = process.env.BASE_URL || "http://localhost";
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/3TFamily";
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome to 3T Family");
});

app.use("/employees", employeeRoute);

const main = async (dbUrl) => {
  try {
    await mongoose.connect(dbUrl);
    console.log(`Connected to database ${dbUrl}`);
    app.listen(PORT, () => {
      console.log(`Server running at ${BASE_URL}:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit process with failure
  }
};

main(DB_URL);
