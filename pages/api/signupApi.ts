import { signIn } from "next-auth/react"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbFind from "../../lib/mongoUtils"
import clientPromise from "../../lib/mongodb"
import randomString from "../../lib/randomString"
import { prisma } from "../../prisma"
import { queryPlace } from "../../lib/place"

async function findUser(db, { email }) {
  console.log("email: ", email)
  const user = await db.collection("users").find({ email: email }).toArray()
  return user
}

async function addUser(db, params) {

  const newUser = { ...params }
  const result =  await db.collection("users").insertOne(JSON.parse(JSON.stringify(newUser)))
  
}

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
  city_id: number
}

async function signup(req) {
  try {
    // const client = new Client({})

    const mongoClient = await clientPromise
    const db = mongoClient.db()

    console.log("req.body", req.body)

    const { name, email, password, city_id }: Props = req.body

    if (isNaN(city_id)) {
      throw new Error("Invalid place IDs")
    }

    // check if place id is valid

    const place = await queryPlace(city_id)
    console.log("place", place)

    if (!place) {
      throw new Error("Place was not found")
    }

    const user = await findUser(db, req.body)
    if (user?.length > 0) {
      return { error: true, message: "user exists" }
    }

    const userId = randomString(15)
    const newUser = {
      userId,
      password,
      email,
      name,
      cityId: place.city_id,
    }
    console.log("newUser", newUser)
     await addUser(db, newUser)

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
