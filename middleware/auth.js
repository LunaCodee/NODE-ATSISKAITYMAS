const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const refreshToken = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ response: "Access token verification failed" });
      } else {
        req.body.userId = decoded.userId;
        return next();
      }
    });
  } else {
    if (refreshToken) {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ response: "Refresh token verification failed" });
        } else {
          req.body.userId = decoded.userId;
          return next();
        }
      });
    } else {
      return res.status(401).json({ response: "No token provided" });
    }
  }
};