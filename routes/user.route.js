import express from "express";
import {
  authenticateUser,
  changeUserPassword,
  createUserAccount,
  deleteUserAccount,
  getCurrentUserProfile,
  signOutUser,
  updateUserProfile,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
import upload from "../utils/multer";
import {
  validatePasswordChange,
  validateSignIn,
  validateSignUp,
} from "../middleware/validation.middleware";

const router = express.Router();

//Auth routes
router.post("/signup", validateSignUp, createUserAccount);
router.post("/signin", validateSignIn, authenticateUser);
router.post("/signout", signOutUser);

//Profile routes
router.get("/profile", isAuthenticated, getCurrentUserProfile);
router.patch(
  "/profile",
  isAuthenticated,
  upload.single("avatar"),
  updateUserProfile
);

//Password management
router.patch(
  "/change-password",
  isAuthenticated,
  validatePasswordChange,
  changeUserPassword
);
router.delete("/account", isAuthenticated, deleteUserAccount);

export default router;
