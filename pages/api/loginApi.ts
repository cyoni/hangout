import { generateAccessToken } from "../../lib/jwtUtils"
import { dbFind } from "../../lib/mongoUtils"
import { queryPlace } from "../../lib/place"

async function login({ email, password }) {
  console.log("req.body", email, password)

  // check if user exists
  const userArray = await dbFind("users", { email })
  console.log("userArray", userArray)

  if (Array.isArray(userArray) && userArray.length === 1) {
    const user = userArray[0]
    const accountPassword = user["password"]
    const profile = user["profile"]
    const userId = user["userId"]
    const cityId = user["cityId"]
    const name = user["name"]
    console.log("password", password + "," + accountPassword)

    const place = await queryPlace(cityId)
    console.log("login place", place)

    // compare passwords
    if (password === accountPassword) {
      console.log("Connecting OK")
      return {
        isSuccess: true,
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
  try {
    const body = req.body
    const result = await login(body)
    console.log("result.data", result)
    if (result?.isSuccess) res.status(200).json(result)
    else res.status(401).json({ isSuccess: false, message: "login failed." })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
