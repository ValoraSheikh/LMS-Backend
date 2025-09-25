import express from "express";
import { createNewCourse, getMyCreatedCourses, getPublishedCourses, searchCourses } from "../controllers/course.controller";
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

  


// Lecture Management


