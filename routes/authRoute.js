import { Router } from "express";
import validate from "../middlewares/validate.js"; 
import authValidation from "../validations/auth.js"; 
import authController from "../controller/authController.js"; 

const authRouter = Router();

// Route for user registration
authRouter.post(
  "/register", 
  validate(authValidation.register), // Validates registration inputs using Joi schema
  authController.register
);

// Route for user login
authRouter.post(
  "/login", 
  validate(authValidation.login), // Validates login inputs using Joi schema
  authController.login
);

// Route for email verification (updated to handle OTP-based flow)
authRouter.post(
  "/verify-email",
  validate(authValidation.verifyEmail), // Validates email and OTP inputs
  authController.verifyEmail
);

export default authRouter;

