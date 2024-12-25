const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Log the Authorization header for debugging

  // Check if the Authorization header is missing or malformed
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Authentication token is missing or invalid. Please log in.",
    });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the decoded payload contains a userId
    if (!decoded.userId) {
      return res.status(403).json({
        message: "Authentication token is invalid. Please log in.",
      });
    }

    // Attach the userId to the request object for further use
    req.userId = decoded.userId;

    // Pass control to the next middleware
    next();
  } catch (error) {
    // Log the error for debugging
    console.error("JWT Verification Error:", error.message);

    // Respond with a generic error message
    return res.status(403).json({
      message:
        "Authentication token is invalid or expired. Please log in again.",
    });
  }
};

module.exports = { authMiddleware };
