require("dotenv").config();
const express = require("express");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const helmet = require("helmet");
const path = require("path");
const mongoose = require("mongoose");

const employeeRoute = require("./routes/employeeRoutes");

const app = express();
const BASE_URL = process.env.BASE_URL || "http://localhost";
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/3TFamily";
const PORT = process.env.PORT || 8080;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "https://via.placeholder.com", "data:"],
      },
    },
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs");
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
