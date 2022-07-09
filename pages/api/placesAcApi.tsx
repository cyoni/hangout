import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma"

type Response = {
  cities: city[]
}

const getSafeString = (input: string): string => {
  input = input.trim()
  if (input && input.length > 20) return null
  const onlyLettersPattern = /[^a-zA-Z\s]+/g
  input = input.replace(onlyLettersPattern, "")
  console.log("input", input)
  return input
}

async function queryLocation(input) {
  const safeString = getSafeString(input)
  if (!safeString) return null
  const cities: city[] = await prisma.$queryRawUnsafe(
    `SELECT city.name as city, 
    city.id as city_id,
    country.id as country_id,
    country.name as country, 
    state.id as province_id,
    state.name as province 
    FROM cities as city 
    INNER JOIN countries as country ON country.id = city.country_id 
    INNER JOIN states as state ON city.state_id = state.id 
    WHERE city.name LIKE '${safeString}%' ORDER BY city.name ASC LIMIT 6`
  )
  return cities
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const input = req.query.input
  const cities = await queryLocation(input)
  if (cities) res.status(200).json({ cities })
  else res.status(400).json(null)
}
