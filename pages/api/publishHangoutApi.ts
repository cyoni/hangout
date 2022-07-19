// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb"
import { isUserVarified } from "../../lib/jwtUtils"
import { TRAVELLING_TABLE } from "../../lib/consts"


async function addTravel(request: TravellingObject) {
  try {
    const client = await clientPromise
    const db = client.db()

    // varify user
    const userAuth = isUserVarified(request.jwt)
    console.log("userAuth", userAuth.isSuccess)

    const dataToDb = {
      userId: request.userId,
      startDate: request.startDate,
      endDate: request.endDate,
      cityId: request.cityId,
      description: request.description,
    }

    if (userAuth?.isSuccess) {
      const data = [{ ...dataToDb }]
      await db
        .collection(TRAVELLING_TABLE)
        .insertMany(JSON.parse(JSON.stringify(data)))
      return { isSuccess: true, message: "post has been published" }
    }
    return { isSuccess: false, message: "auth error." }
  } catch (error) {
    return { isSuccess: false, message: error.message }
  }
}

export default async function handler(req, res) {
  const result = await addTravel(req.body)
  if (result.isSuccess) res.status(200).json(result)
  else res.status(400).json(result)
}
