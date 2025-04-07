import { Router } from "express";
import validate from "../middlewares/validate.js";
import authController from "../controller/authController.js";
import userValidation from "../validations/auth.js"; // Correct import for validation

const authRouter = Router();

// Route for admin registration
authRouter.post(
  "/register/admin",
  validate(userValidation.register), // Validates registration inputs using Joi schema
  (req, res, next) => {
    req.body.role = "admin"; // Assign "admin" role to the request body
    next(); // Proceed to the register controller
  },
  authController.register
);

// Route for writer registration
authRouter.post(
  "/register/writer",
  validate(userValidation.register), // Validates registration inputs using Joi schema
  (req, res, next) => {
    req.body.role = "writer"; // Assign "writer" role to the request body
    next(); // Proceed to the register controller
  },
  authController.register
);

// Route for reader registration
authRouter.post(
  "/register/reader",
  validate(userValidation.register), // Validates registration inputs using Joi schema
  (req, res, next) => {
    req.body.role = "reader"; // Assign "reader" role to the request body
    next(); // Proceed to the register controller
  },
  authController.register
);

// Route for user login
authRouter.post(
  "/login",
  validate(userValidation.login), // Validates login inputs using Joi schema
  authController.login
);

// Route for email verification (updated to handle OTP-based flow)
authRouter.post(
  "/verify-email",
  validate(userValidation.verifyEmail), // Validates email and OTP inputs
  authController.verifyEmail
);



export default authRouter;
