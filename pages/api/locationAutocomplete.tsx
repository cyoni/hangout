import clientPromise from "../../lib/mongodb"
import { isUserVarified } from "../../lib/jwtUtils"
import { countries, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Response = {
  result: countries[]
}

async function queryLocation(location) {
  const prisma = new PrismaClient()
  const cities = await prisma.cities.findMany({
    where: {
      name: {
        startsWith: location,
      },
    },
    include: {
      state: true,
      country: true,
    },
    take: 5,
  })
  return cities
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const location = req.query.location
  const result = await queryLocation(location)
  if (result) res.status(200).json({ result })
  else res.status(400)
}
