const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "defaultJwtSecret";

// JWT Middleware
module.exports.authenticateJwt = (req, res, next) => {
  const token = req.signedCookies.jwt;
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports.generateToken = (user) => {
  console.log(user._id);
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
};
