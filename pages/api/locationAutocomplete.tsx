import clientPromise from "../../lib/mongodb"
import { isUserVarified } from "../../lib/jwtUtils"
import { countries, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"
type Response = {
  result: countries[]
}

async function queryLocation(location) {
  const cities = await prisma.$queryRawUnsafe(
    `SELECT a.name as city, b.name  as country, c.name as state FROM cities as a INNER JOIN countries as b ON b.id = a.country_id INNER JOIN states as c ON a.state_id = c.id WHERE a.name LIKE '${location}%' LIMIT 6`
  )

  // const cities = await prisma.cities.findMany({
  //   where: {
  //     name: {
  //       startsWith: location,
  //     },
  //   },
  //   include: {
  //    // state: true,

  //     countries: true,

  //   },
  //   take: 5,
  // })
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
