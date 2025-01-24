import { catchAsync } from "../helper/catchAsync.js";
import User from "../models/users.js"; // Adjusted model import
import { createJWT, findUserByEmail } from "../service/user.js";
import bcrypt from "bcrypt";
import { generateOTP, sendEmailWithOTP } from "../mailer/email.js"; // Import email functions
import Otp from "../models/otp.js"; // Adjusted model import for OTP

const register = catchAsync(async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new Error("Email already taken");
    } else {
      const otp = generateOTP();
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

      await Otp.create({ email, otp, expirationTime });
      await sendEmailWithOTP(email, otp);

      return res.status(200).json({
        message: "Email already registered, please check your inbox for the OTP.",
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    isEmailVerified: false,
    role: "reader", // Default role
  });

  const otp = generateOTP();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.create({ email, otp, expirationTime });
  await sendEmailWithOTP(email, otp);

  return res.status(201).json({
    message: "Registration successful. Please verify your email.",
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    throw new Error("Invalid OTP or email");
  }

  if (otpRecord.expirationTime < Date.now()) {
    throw new Error("OTP has expired");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  );

  await Otp.deleteOne({ email });

  return res.status(200).json({
    message: "Email verified successfully",
    user: updatedUser,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    throw new Error("User not found.");
  }

  if (!existingUser.isEmailVerified) {
    throw new Error("Please verify your email first.");
  }

  const matched = await bcrypt.compare(password, existingUser.password);
  if (!matched) {
    throw new Error("Invalid email or password.");
  }

  const token = createJWT(existingUser._id);

  return res.status(200).json({
    message: "Login successful.",
    user: {
      name: existingUser.name,
      email: existingUser.email,
      token,
    },
  });
});

const authController = {
  register,
  verifyEmail,
  login,
};

export default authController;
