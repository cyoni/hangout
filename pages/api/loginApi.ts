import { generateAccessToken } from "../../lib/jwtUtils"
const jwt = require("jsonwebtoken")
import { dbFind } from "../../lib/dbFind"

async function login(req) {
  const { email, password } = req.body
  console.log("req.body", req.body)

  // check if user exists
  const userArray = await dbFind("users", { email: email })
  console.log("userArray", userArray)

  if (userArray && userArray.length === 1) {
    const user = userArray[0]
    const accountPassword = user["password"]
    const userId = user["userId"]
    const place = user["place"]
    const name = user["name"]
    console.log("password", password + "," + accountPassword)
    // compare passwords
    if (password === accountPassword) {
      // generate token
      const token: string = generateAccessToken({ userId, name, place })
      console.log("Connecting OK")
      return {
        isSuccess: true,
        token,
      }
    } else {
      return { isSuccess: false, message: "wrong password" }
    }
  }

  return { isSuccess: false, message: "user not exists" }
}

export default async function handler(req, res) {
  const body = req.body
  const result = await login(req)
  if (result?.isSuccess) res.status(200).json(result)
  else res.status(200).json({ isSuccess: false, message: "login failed." })
}
