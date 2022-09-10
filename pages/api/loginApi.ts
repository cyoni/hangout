import { dbFind } from "../../lib/mongoUtils"
import { queryPlace } from "../../lib/place"

async function login({ email, password }) {
  console.log("req.body", email, password)

  // check if user exists
  const userArray = await dbFind("users", { $and: [{ email, password }] })
  console.log("userArray", userArray)

  if (Array.isArray(userArray) && userArray.length === 1) {
    const user = userArray[0]

    // const profile = user["profile"]
    // const userId = user["userId"]
    // const cityId = user["cityId"]
    // const name = user["name"]

    const place = await queryPlace(user.cityId)
    console.log("login place", place)

    console.log("Connecting OK")
    return {
      place,
      ...user,
    }
  }

  return { error: "AUTH ERROR" }
}

export default async function handler(req, res) {
  try {
    const body = req.body
    const result = await login(body)
    console.log("result.data", result)
    if (!result.error) res.status(200).json(result)
    else res.status(401).json({ isSuccess: false, message: "login failed." })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
