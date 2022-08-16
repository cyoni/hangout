import { getToken } from "next-auth/jwt"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb"
import { TRAVELLING_TABLE as TRAVELING_TABLE } from "../../lib/consts"
import { dbInsertMany } from "../../lib/mongoUtils"

async function addTravel({ itineraries, userId }) {
  const dataToDb = {
    userId,
    timestamp: Date.now(),
    itineraries,
  }
  const data = [{ ...dataToDb }]
  console.log("data to db", data)

  const res: MongoInsertRes = await dbInsertMany(
    TRAVELING_TABLE,
    JSON.parse(JSON.stringify(dataToDb))
  )

  if (res.acknowledged) return { isSuccess: true }
  throw Error("Could not insert to db")
}

export default async function handler(req, res) {
  try {
    const token = await getToken({ req })
    if (!token) throw Error("auth failed")
    const result = await addTravel({
      itineraries: req.body.itineraries,
      userId: token.userId,
    })
    if (result.isSuccess) res.status(200).json({ isSuccess: true })
  } catch (e) {
    res.status(400).json({ isError: true, message: e.message })
  }
}
