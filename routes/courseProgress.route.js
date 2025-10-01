import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import {
  getUserCourseProgress,
  markCourseAsCompleted,
  resetCourseProgress,
  updateLectureProgress,
} from "../controllers/courseProgress.controller";

const router = express.Router();

router.get("/progress/:courseId", isAuthenticated, getUserCourseProgress);

router.patch(
  "/progress/:courseId/lectures/:lectureId",
  isAuthenticated,
  updateLectureProgress
);

router.patch(
  "/progress/:courseId/complete",
  isAuthenticated,
  markCourseAsCompleted
);

router.patch("/progress/:courseId/reset", isAuthenticated, resetCourseProgress);

export default router;