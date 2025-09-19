import { body, query, validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validations.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedError = errors.array().map((err) => ({
      field: err.path,
      message: err.message,
    }));

    throw new Error("Validation Error");
  };
};

export const commonValidations = {
  pagination: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be a between 1 and 100"),
  ],
  email: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  name: body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Please provivide a valid name"),
  bio: body("bio")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("You didn't write anything in Bio"),
};

export const validateSignUp = validate([
  commonValidations.email,
  commonValidations.name,
  commonValidations.bio,
]);
