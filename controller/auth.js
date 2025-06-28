import { user } from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isValidEmailStrict } from "../middleware/emailValidator.js";
import { transporter } from "../config/nodemailer.js";

dotenv.config();

export const Register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // Checking for valid email ID
    const flag = isValidEmailStrict(email);
    //if email is valid
    if (flag) {
      const data = await user.findOne({ email });
      if (data) {
        return res
          .status(401)
          .json({ success: false, message: "User Already exists" });
      }
      const hashpass = await bcrypt.hash(password, 10);
      await user.create({ email, password: hashpass, username });
      return res
        .status(200)
        .json({ success: true, message: "User registered" });
    }

    // return if email is invalid
    return res.status(400).json({ success: false, message: "invalid email" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const CurrUser = await user.findOne({ email });
    if (!CurrUser) {
      return res
        .status(400)
        .json({ success: false, message: "User dosen't exists" });
    }
    const isMatch = await bcrypt.compare(password, CurrUser.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: email, username: CurrUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.cookie("token", token, {
      maxAge: 7200000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const Logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false, // true if you're using HTTPS
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
     if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }
    const User = await user.findOne({ email });
    if (!User)
      return res.status(200).json({ 
        success: true, 
        message: "If an account with that email exists, a password reset link has been sent" 
      });;
    const secret = process.env.JWT_SECRET + User.password;
    const token = jwt.sign({ id: User._id, email: User.email }, secret, {
      expiresIn: "15m",
    });
    const resetURL =
      `http//localhost:8000/api/auth/resetpassword?id=${User._id}&token=${token}`; // Reset URL to be Inserted

    const mailOptions = {
      to: User.email,
      from: '"Next-Press" noreply@genvwebsters.com',
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
       This link will expire in 15 minutes and can only be used once.\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Password reset link sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const resetPassword = async (req, res, next) => {
  const { id, token } = req.query;
  const { password } = req.body;

  try {
    const User = await user.findOne({ _id: id });
    if (!User) {
      return res
        .status(400)
        .json({ success: false, message: "User not exists!" });
    }

    const secret = process.env.JWT_SECRET + User.password;

    const verify = jwt.verify(token, secret);
    if (!verify) {
      return res.status(400).json({ success: false, message: "Invalid Token" });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    User.password = encryptedPassword;
    await User.save();
    res.status(200).json({ success: true, message: "Password has been reset" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
