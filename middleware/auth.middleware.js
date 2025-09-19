import { ApiError, catchAsync } from "./error.middleware";
import jwt from 'jwt'

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    throw new ApiError("You are not logged in", 403)
  }

  try {
    const decoded = await jwt.verfiy(token, process.env.SECRET_KEY);
    req.id = decoded.userId;
    next();
  } catch (error) {
    throw new ApiError("JWT token error", 401)
  }
})