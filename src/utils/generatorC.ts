import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (res: Response, userId: Number) => {
  const token = jwt.sign({ userId }, process.env.FIRMA as string, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
