require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const express = require("express");
const methodOverride = require("method-override");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Member = require("./models/member");
const cookieParser = require("cookie-parser");
const membersRoute = require("./routes/membersRoute");
const { authenticateJwt, generateToken } = require("./middleware");

const app = express();

const BASE_URL = process.env.BASE_URL || "http://localhost";
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/3tfamily";
const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "defaultSecret";
const JWT_SECRET = process.env.JWT_SECRET || "defaultJwtSecret";

console.log(BASE_URL, DB_URL, PORT);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser(COOKIE_SECRET));
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

// Passport setup
passport.use(new LocalStrategy(Member.authenticate()));
passport.serializeUser(Member.serializeUser());
passport.deserializeUser(Member.deserializeUser());

app.use(passport.initialize());

// Routes
app.use("/members", authenticateJwt, membersRoute);

app.get("/", (req, res) => {
  res.send("Welcome To 3T Family! We are very happy to have you with us.");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const member = await Member.findOne({ email });
    if (!member || !(await member.authenticate(password))) {
      return res.status(401).send("Invalid credentials");
    }
    const token = generateToken(member);
    res.cookie("jwt", token, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });
    res.send(`Login successful: ${token}`);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.send("Logged out");
});

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
