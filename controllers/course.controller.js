import { ApiError } from "../middleware/error.middleware";
import { Course } from "../models/course.model";
import { User } from "../models/user.model";
import { uploadMedia } from "../utils/cloudinary";

export const createNewCourse = catchAsync(async (req, res) => {
  const { title, suntitle, description, category, level, price } = req.body;

  let thumbnail;
  if (req.file) {
    const result = await uploadMedia(req.file);
    thumbnail = result?.secure_url || req.file.path;
  } else {
    throw new ApiError("Thumnail is required", 400);
  }

  let user = await User.findById(req.id);

  if (!user) {
    throw new ApiError("First you have to create a user account");
  }

  const createCourse = await Course.create({
    title,
    suntitle,
    description,
    category,
    level,
    price,
    thumbnail,
    instructor: user,
  });

  await User.findByIdAndUpdate(req.id, {
    $push: { createdCourses: createCourse._id },
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course: createCourse,
  });
});


