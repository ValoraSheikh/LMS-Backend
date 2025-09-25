import { User } from "../models/user.model";
import { ApiError, catchAsync } from "./error.middleware";
import jwt from "jwt";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError("You are not logged in", 403);
  }

  try {
    const decoded = await jwt.verfiy(token, process.env.SECRET_KEY);
    req.id = decoded.userId;

    const user = await User.findById(req.id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError("JWT token error", 401);
  }
});

export const restrictTo = (...roles) => {
  return catchAsync(async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        "You do not have permission to perform this action",
        403
      );
    }
    next();
  });
};
