import jwt from "jsonwebtoken";
import { errorBody } from "../helpers/errorBody.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(errorBody(401, "Access Denied, No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorBody(403, "Invalid or expired token"));
      }
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};
