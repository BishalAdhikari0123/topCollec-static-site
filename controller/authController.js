import { catchAsync } from "../helper/catchAsync.js";
import User from "../models/users.js";
import { createJWT, findUserByEmail } from "../service/user.js";
import bcrypt from 'bcrypt';
import { generateOTP, sendEmailWithOTP } from "../mailer/email.js";  // Import email functions
import { Otp } from "../models/otp.js"; // OTP schema for storing OTP

const register = catchAsync(async (req, res) => {
  const { email, username, password } = req.body;

  console.log("Email debug");
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
  
  // console.log("Email verification debug");
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    isEmailVerified: false,
  });

  const otp = generateOTP();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); 

  await Otp.create({ email, otp, expirationTime });

  await sendEmailWithOTP(email, otp);

  // const token = createJWT(newUser._id);

  return res.status(201).json({
    message: "Registration successful. Please verify your email.",
    user: {
      username: newUser.username,
      email: newUser.email,
      // token,
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

export { register, verifyEmail };

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
      username: existingUser.username,
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
