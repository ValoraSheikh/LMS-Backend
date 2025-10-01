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


