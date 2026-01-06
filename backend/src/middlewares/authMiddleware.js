import jwt from "jsonwebtoken";
import User from "../models/User.js";

// xac minh user
export const protectedRoute = (req, res, next) => {
  try {
    //lay token tu header
    const authHaeder = req.headers["authorization"];
    const token = authHaeder && authHaeder.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "khong tim thays accesstoken" });
    }
    //xac nhan token hople
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodeedUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "accesstoken het han hoac khong dung" });
        }
        const user = await User.findById(decodeedUser.userId).select(
          "-hashedPassword"
        );
        //tim user
        if (!user) {
          return res.status(404).json({
            message: "nguoi dung khong ton tai",
          });
        }
        //tra user ve trong req
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("loi khi xac thuc nguoi dung middleware", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};

// Export verifyToken as alias for protectedRoute
export const verifyToken = protectedRoute;
