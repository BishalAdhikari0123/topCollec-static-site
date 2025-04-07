import { catchAsync } from "../helper/catchAsync.js";
import User from "../models/users.js"; // Adjusted model import
import { createJWT, findUserByEmail } from "../service/user.js";
import bcrypt from "bcrypt";
import { generateOTP, sendEmailWithOTP } from "../mailer/email.js"; // Import email functions
import Otp from "../models/otp.js"; // Adjusted model import for OTP

const register = catchAsync(async (req, res) => {
  const { email, username, name, password, role, bio, profileImage, permissions, portfolio, expertise, preferences } = req.body;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new Error("Email already taken");
    } else {
      const otp = generateOTP();
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      await Otp.create({ email, otp, expirationTime });
      await sendEmailWithOTP(email, otp);

      return res.status(200).json({
        message: "Email already registered, please check your inbox for the OTP.",
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Handling role-based specific fields
  let roleSpecificFields = {};

  if (role === "admin") {
    if (!permissions || permissions.length === 0) {
      throw new Error("Admin role must have at least one permission.");
    }
    roleSpecificFields = { permissions };
  } else if (role === "writer") {
    roleSpecificFields = { portfolio, expertise };
  } else if (role === "reader") {
    roleSpecificFields = { preferences };
  }

  const newUser = await User.create({
    username, // Ensure that the username is included here
    name,
    email,
    password: hashedPassword,
    isEmailVerified: false,  // Ensure email is not verified upon registration
    role,
    bio,
    profileImage,
    ...roleSpecificFields,
  });

  const otp = generateOTP();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

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

  // Update the user's isEmailVerified to true
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true }
  );

  // Remove the OTP record from the database
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
      role: existingUser.role,
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

