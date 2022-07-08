require("dotenv").config();

const jwt = require("jsonwebtoken");
const path = require("path");

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
}

export function isUserVarified(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return null;
    return {
      isSuccess: true,
      message: "Authentication succeded.",
      jwt: token,
      user,
    };
  });
}
