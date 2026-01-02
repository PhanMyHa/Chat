import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "khong the thieu username, password, email,firstname, lastname",
      });
    }
    // check duplicate
    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
      return res.status(409).json({ message: "username da ton tai" });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.error("loi khi goi singUp", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};
export const signIn = async (req, res) => {
  try {
    // get input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "thieu username hoac password" });
    }
    //check username
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "username hoac password khong dung" });
    }
    //check password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "username hoac password khong chinh xac" });
    }
    //true-> accesstoken with jwt
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );
    // create refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    // create session->save refreshtoken
    await Session.create({
      userId: user._id,
      refreshToken,
      expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    // res resfrehtoken ve cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false ,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    // return accesstoken
    return res.status(200).json({
      message: `User ${user.displayName} da logged in`,
      accessToken,
    });
  } catch (error) {
    console.error("loi khi goi singIn", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};
export const signOut = async (req, res) => {
  try {
    // lay refresh token tu cookie
    const token = req.cookies.refreshToken;
    if (token) {
      //xoa refresh token trong session
      await Session.deleteOne({ refreshToken: token });
      //xoa cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("loi khi goi singOut", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};
