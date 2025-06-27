import { user } from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isValidEmailStrict } from "../middleware/emailValidator.js";
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
      secure: true,
      sameSite: "none",
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
      sameSite: "none",
      secure: true, // true if you're using HTTPS
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
