import User from "../models/user.model.js";
import { errorBody } from "../helpers/errorBody.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Otp from "../models/otp.model.js";
import dotenv from "dotenv";
dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
// });

// export const sendSignupOtp = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email is already registered." });
//     }
//     const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

//     await Otp.deleteMany({ email });
//     await Otp.create({ email, otp: generatedOtp });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Cantilever Core - Verify Your Email",
//       html: `
//         <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
//           <h2>Welcome to the Network!</h2>
//           <p>Your verification code is:</p>
//           <h1 style="color: #dc2626; letter-spacing: 5px;">${generatedOtp}</h1>
//           <p>This code will expire in 5 minutes.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return res
//       .status(200)
//       .json({ success: true, message: "OTP sent to email." });
//   } catch (error) {
//     next(error);
//   }
// };

export const Register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(
        errorBody(400, "Please provide username, email and password"),
      );
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return next(errorBody(409, "Email already exists"));
    }

    // const validOtpRecord = await Otp.findOne({ email, otp });

    // if (!validOtpRecord) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid or expired OTP." });
    // }

    // console.log(validOtpRecord);

    // await Otp.deleteMany({ email });

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const { username, email, avatar } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const newUser = new User({
        username,
        email,
        password,
        avatar,
      });

      user = await newUser.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorBody(400, "Please provide email and password"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(errorBody(401, "Invalid Login Credentials"));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(errorBody(401, "Invalid Login Credentials"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const GetUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(200).json({ success: true, user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(200).json({ success: true, user: null });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(200).json({ success: true, user: null });
  }
};
