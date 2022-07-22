import { generateAccessToken } from "../../lib/jwtUtils"
const jwt = require("jsonwebtoken")
import { dbFind } from "../../lib/mongoUtils"
import { queryPlace } from "../../lib/place"

async function login({ email, password }) {
  console.log("req.body", email, password)

  // check if user exists
  const userArray = await dbFind("users", { email: email })
  console.log("userArray", userArray)

  if (userArray && userArray.length === 1) {
    const user = userArray[0]
    const accountPassword = user["password"]
    const userId = user["userId"]
    const { cityId } = user["place"]
    const name = user["name"]
    console.log("password", password + "," + accountPassword)

    const place = await queryPlace(cityId)
    console.log("login place", place)

    // compare passwords
    if (password === accountPassword) {
      // generate token
      const accessToken: string = generateAccessToken({ userId, name, place })
      console.log("Connecting OK")
      return {
        isSuccess: true,
        accessToken,
        userId,
        name,
        place,
      }
    } else {
      return { isSuccess: false, message: "wrong password" }
    }
  }

  return { isSuccess: false, message: "user not exists" }
}

export default async function handler(req, res) {
  const body = req.body
  const result = await login(body)
  console.log("result.data", result)
  if (result?.isSuccess) res.status(200).json(result)
  else res.status(401).json({ isSuccess: false, message: "login failed." })
}
