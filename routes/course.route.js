import express from "express";
import {
  createNewCourse,
  getMyCreatedCourses,
  getPublishedCourses,
  searchCourses,
} from "../controllers/course.controller";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware";
import upload from "../utils/multer";

const router = express.Router();

// Public Routes
router.get("/published", getPublishedCourses);
router.get("/search", searchCourses);

// Protected routes
router.use(isAuthenticated);

// Course Management
router
  .route("/")
  .post(restrictTo("instructor"), upload.single("thumbnail"), createNewCourse)
  .get(restrictTo("instructor"), getMyCreatedCourses);

// Course details and updates
router
  .route("/c/:courseId")
  .get(getCourseDetails)
  .patch(
    restrictTo("instructor"),
    upload.single("thumbnail"),
    updateCourseDetails
  );

// Lecture Management

router
  .route("/c/:courseId/lectures")
  .get(getCourseLectures)
  .post(restrictTo("instructor"), upload.single("video"), addLectureToCourse);

export default router;
