import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  // 🔥 GET TOKEN
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 🔥 NO TOKEN
  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    // 🔥 VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 ATTACH USER
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
