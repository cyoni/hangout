import { ACCOUNT_EXISTS_CODE } from "./../../lib/consts"
import { sha256 } from "js-sha256"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb"
import randomString from "../../lib/randomString"
import { queryPlace } from "../../lib/place"
import { createUser, getUserByEmail, registerUserFlow } from "../../lib/loginUtils"
import { followCity } from "./followApi"

const getValueFromAddress = (addressComponents, type) => {
  for (let i = 0; i < addressComponents.length; i++) {
    if (addressComponents[i].types.includes(type)) {
      return addressComponents[i].long_name
    }
  }
}

interface Props {
  name: string
  email: string
  password: string
  cityId: number
}

async function signup(req) {
  try {
    const mongoClient = await clientPromise
    const db = mongoClient.db()

    console.log("req.body", req.body)

    const { name, email, password, cityId }: Props = req.body

    if (isNaN(cityId)) {
      throw new Error("Invalid place IDs")
    }

    // check if place id is valid
    const place = await queryPlace(cityId)
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
      cityId: place.city_id,
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
