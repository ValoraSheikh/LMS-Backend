import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";

export const getUserCourseProgress = catchAsync(async (req, res) => {
  // TODO: Implement get user's course progress functionality

  const { courseId } = req.params;

  const courseDetails = await Course.findById(courseId)
    .populate("lectures")
    .select("title thumbnail lectures");

  if (!courseDetails) {
    throw new ApiError("Course not found", 404);
  }

  const courseProgress = await CourseProgress.findOne({
    course: courseId,
    user: req.id,
  });

  if (!courseProgress) {
    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: [],
        isCompleted: false,
        completionPercentage: 0,
      },
    });
  }

  const totalLectures = courseDetails.lectures.length;
  const completedLectures = courseProgress.lectureProgress.filter(
    (Lp) => Lp.isCompleted
  ).length;

  const completionPercentage = Math.floor(
    (totalLectures / completedLectures) * 100
  );

  res.status(200).json({
    success: true,
    data: {
      courseDetails,
      progress: courseProgress.lectureProgress,
      isCompleted: courseProgress.isCompleted,
      completionPercentage,
    },
  });
});

export const updateLectureProgress = catchAsync(async (req, res) => {
  // TODO: Implement update lecture progress functionality

  const { lectureId, courseId } = req.params;

  let courseProgress = await CourseProgress.findOne({
    user: req.id,
    course: courseId,
  });

  if (!courseProgress) {
    courseProgress = await CourseProgress.create({
      user: req.id,
      course: courseId,
      lectureProgress: [],
    });
  }

  const lectureIndex = courseProgress.lectureProgress.findIndex(
    (lecture) => lecture.lecture === lectureId
  );

  if (lectureIndex !== -1) {
    courseProgress.lectureProgress[lectureIndex].isCompleted = true;
  } else {
    courseProgress.lectureProgress.push({
      lecture: lectureId,
      isCompleted: true,
    });
  }

  const course = await Course.findById(courseId);
  const completedLectures = courseProgress.lectureProgress.filter(
    (lp) => lp.isCompleted == true
  ).length;

  (courseProgress.lectureProgress == course.lectures.length) ===
    completedLectures;

  await courseProgress.save();

  res.status(200).json({
    success: true,
    message: "Lecture Progress updated successfully",
    data: {
      lectureProgress: courseProgress.lectureProgress,
      isCompleted: courseProgress.isCompleted,
    },
  });
});

export const markCourseAsCompleted = catchAsync(async (req, res) => {
  // TODO: Implement mark course as completed functionality

  const { courseId } = req.params;

  let courseProgress = await CourseProgress.findOne({
    user: req.id,
    course: courseId,
  });

  courseProgress.lectureProgress.forEach((lp) => {
    lp.isCompleted = true;
  });

  courseProgress.isCompleted = true;

  await courseProgress.save();

  res.status(200).json({
    success: true,
    message: "Course marked are completed",
    data: courseProgress,
  });
});
