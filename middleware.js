const jwt = require("jsonwebtoken");
const Member = require("./models/member");
const JWT_SECRET = "defaultJwtSecret";

module.exports.authenticateJwt = async (req, res, next) => {
  const token = req.signedCookies.jwt;

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403); 
      try {
        const user = await Member.findById(decoded.id);
        if (!user) {
          return res.status(403).json({ message: "User no longer exists" });
        }
        req.user = user;
        next();
      } catch (error) {
        console.error("Database error:", error);
        return res.sendStatus(500); 
      }
    });
  } else {
    return res.sendStatus(401); // No token provided
  }
};

module.exports.authorizeRole = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role; // Access role from req.user
  if (allowedRoles.includes(userRole)) {
    next();
  } else {
    res.status(403).send("Forbidden: You do not have access to this resource");
  }
};

module.exports.generateToken = (user) => {
  console.log(user._id);
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return {token, role:user.role, id:user._id}
};
