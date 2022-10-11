import { USERS_COLLECTION } from "./../../lib/consts"
import { sha256 } from "js-sha256"
import { dbFind } from "../../lib/mongoUtils"
import { queryPlace } from "../../lib/Places/placeUtils"
import { getUserByEmailAndPassword } from "../../lib/loginUtils"

async function login({ email, password }) {
  console.log("req.body", email, password)

  // encrypt password
  var hash = sha256.create()
  hash.update(password)

  // check if user exists
  const user = await getUserByEmailAndPassword(email, hash.toString())

  if (user) {
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
