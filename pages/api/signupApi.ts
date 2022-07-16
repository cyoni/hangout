// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbFind from "../../lib/dbFind"
import clientPromise from "../../lib/mongodb"
import randomString from "../../lib/randomString"
import { generateAccessToken } from "../../lib/jwtUtils"
import { Client } from "@googlemaps/google-maps-services-js"
import { prisma } from "../../prisma"
import { queryPlace } from "../../lib/place"

async function findUser(db, { email }) {
  console.log("email: ", email)
  const user = await db.collection("users").find({ email: email }).toArray()
  return user
}

async function addUser(db, params) {
  //const user = await dbFind("users", { userId })
  // if (!user || user.length === 0) {
  const newUser = { ...params }
  await db.collection("users").insertOne(JSON.parse(JSON.stringify(newUser)))
  // }
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

    const { name, email, password, city_id }: Props =
      req.body

    if (isNaN(city_id) ) {
      throw new Error("Invalid place IDs")
    }

    // check if place id is valid

    const place = await queryPlace(city_id)
    console.log("PLACE", place)
    if (!place) {
      throw new Error("Place was not found")
    }

    // const user = await findUser(db, req.body)
    // if (user?.length > 0) {
    //   return { error: true, message: "user exists" }
    // }

    const userId = randomString(10)
    const newUser = { userId, name, password, email, place }
    console.log("newUser", newUser)
    await addUser(db, newUser)

    // generate JWT:
    const token = generateAccessToken({ userId })

    return { isSuccess: true, token, userId }
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
