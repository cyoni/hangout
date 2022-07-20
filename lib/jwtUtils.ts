require("dotenv").config()

const jwt = require("jsonwebtoken")
const path = require("path")

interface AccessTokenReq {
  userId: string
  name: string
  place: Place
}
export function generateAccessToken(payload: AccessTokenReq) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  })
}
export function isUserVarified(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return null
    return {
      isSuccess: true,
      message: "AUTH SUCCEDED",
      jwt: token,
      user,
    }
  })
}
