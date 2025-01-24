import { Router } from "express";
import validate from "../middlewares/validate.js"; 
import authValidation from "../validations/auth.js"; 
import authController from "../controller/authController.js"; 

const authRouter = Router();

authRouter.post(
  "/register", 
  validate(authValidation.register),
  authController.register 
);

authRouter.post(
  "/login", 
  validate(authValidation.login),
  authController.login 
);

authRouter.get(
  "/verify-email/:token", 
  authController.verifyEmail 
);

export default authRouter;

