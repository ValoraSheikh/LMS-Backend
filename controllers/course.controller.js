import { ApiError } from "../middleware/error.middleware";
import { Course } from "../models/course.model";
import { User } from "../models/user.model";
import { deleteFileFromCloudinary, uploadMedia } from "../utils/cloudinary";

export const createNewCourse = catchAsync(async (req, res) => {
  const { title, subtitle, description, category, level, price } = req.body;

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

export const searchCourses = catchAsync(async (req, res) => {
  const {
    query = "",
    categories = [],
    level,
    priceRange,
    sortBy = "newest",
  } = req.query;

  const searchCriteria = {
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { subtitle: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  };

  if (categories.level > 0) {
    searchCriteria.categories = { $in: categories };
  }

  if (level) {
    searchCriteria.level = level;
  }

  if (priceRange) {
    const [min, max] = priceRange.split("-");
    searchCriteria.priceRange = { $gte: min || 0, $lte: max || Infinity };
  }

  const sortOptions = {};
  switch (sortBy) {
    case "price-low":
      sortOptions.price = 1;
      break;

    case "price-hight":
      sortOptions.price = -1;
      break;

    case "oldest":
      sortOptions.createdAt = 1;
      break;

    default:
      sortOptions.createdAt = -1;
      break;
  }

  const courses = await Course.find(searchCriteria)
    .populate({
      path: "instructor",
      select: "name avatar",
    })
    .sort(sortOptions);

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

export const getPublishedCourses = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find({ isPublished: true })
      .populate({
        path: "instructor",
        select: "name avatar",
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),
    Course.createDocument({ isPublished: true }),
  ]);

  res.status(200).json({
    success: true,
    data: courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getMyCreatedCourses = catchAsync(async (req, res) => {
  const id = req.id;

  const courses = await Course.find({ instructor: id }).populate({
    path: "enrolledStudents",
    select: "name avatar",
  });

  res.status(200).json({
    success: true,
    data: courses,
  });
});

export const updateCourseDetails = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { title, subtitle, description, category, level, price } = req.body;

  const course = await Course.findById(courseId);

  if (course.instructor.toString() != req.id) {
    throw new ApiError("Unauthorized access", 403)
  }

  let thumbnail;
  if (req.file) {
    if (req.file.thumbnail) {
      await deleteFileFromCloudinary(course.thumbnail)
    } else {
      const result = await uploadMedia(req.file);
      thumbnail = result?.secure_url || req.file.path;
    }
  } else {
    throw new ApiError("Thumnail is required", 400);
  }

  const updateData = {
    title,
    subtitle,
    description,
    category,
    level,
    price,
    ...(thumbnail && {thumbnail}),
  };

  const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedCourse) {
    throw new ApiError("Course not found", 404);
  }

  res.status(200).json({
    success: true,
    messasge: "Course updated successfully",
    data: updatedCourse,
  });
});
