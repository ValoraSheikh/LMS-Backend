import express from "express";
import {
  authenticateUser,
  createUserAccount,
  getCurrentUserProfile,
  signOutUser,
  updateUserProfile,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
import upload from "../utils/multer";
import { validateSignUp } from "../middleware/validation.middleware";

const router = express.Router();

//Auth routes
router.post("/signup", validateSignUp, createUserAccount);
router.post("/signin", authenticateUser);
router.post("/signout", signOutUser);

//Profile routes
router.get("/profile", isAuthenticated, getCurrentUserProfile);
router.patch(
  "/profile",
  isAuthenticated,
  upload.single("avatar"),
  updateUserProfile
);

export default router;
