import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // req.cookies: Contains all the cookies sent with the HTTP request as an object. You can access any cookie by its name, e.g., req.cookies['cookieName'].  // req.cookies.userToken: Directly accesses the value of the cookie named userToken  // cookie-parser Middleware: In order to use req.cookies, you need to use the cookie-parser middleware, as it populates the cookies object.

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user information to the request object--
    next(); // Proceed to the next middleware or route // Access the user from req.user, which was set by the authentication middleware in this case after next the subsequent fn will catch req.user
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
