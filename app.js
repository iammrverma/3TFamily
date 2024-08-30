require("dotenv").config();
const express = require("express");

const app = express();
const BASE_URL = process.env.BASE_URL || "http://localhost";
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome to 3T Family");
});


app.listen(PORT, () => {
  console.log(`Server running at ${BASE_URL}:${PORT}`);
});
