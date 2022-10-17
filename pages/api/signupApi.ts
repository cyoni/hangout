import { ACCOUNT_EXISTS_CODE } from "../../lib/consts/consts"
import { sha256 } from "js-sha256"
import clientPromise from "../../lib/mongodb"
import {
  createUser,
  getUserByEmail,
  registerUserFlow,
} from "../../lib/ApiUtils/loginApiUtils"
import { queryPlace } from "./queryPlacesApi"

interface Props {
  name: string
  email: string
  password: string
  placeId: string
}

async function signup(req) {
  try {
    console.log("req.body", req.body)

    const { name, email, password, placeId }: Props = req.body

    if (!placeId) {
      throw new Error("Invalid place IDs")
    }

    // check if place id is valid
    const place = await queryPlace(placeId)
    console.log("place", place)

    if (!place) {
      throw new Error("Place was not found")
    }

    const userFromDb = await getUserByEmail(email)
    if (userFromDb) {
      return {
        error: true,
        message: "user already exists",
        codeId: ACCOUNT_EXISTS_CODE,
      }
    }

    var hash = sha256.create()
    hash.update(password)

    const newUser = await registerUserFlow({
      password: hash.toString(),
      email,
      name,
      placeId: place.placeId,
    })

    if (!newUser) {
      throw new Error("there was an error creating the user")
    }

    return { isSuccess: true }
  } catch (error) {
    console.log("error", error.message)
    return { error: true, message: error.message }
  }
}

export default async function handler(req, res) {
  const body = req.body
  const result = await signup(req)
  if (result?.isSuccess) res.status(200).json(result)
  else res.status(400).json(result)
}
