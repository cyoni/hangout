import { getToken } from 'next-auth/jwt';
import { defaultBackground } from '../../lib/consts';
import type { NextApiRequest, NextApiResponse } from "next"
import data from "../../lib/cityImages.json"
import { getUnsplashImageByText } from "../../lib/unsplash"

type Response = {
  picture: string
}

async function getPicture(input) {
  // look for city in the cities json
  const cities = data.filter((x) => x.full_name?.includes(input))
  console.log("found", cities.length, "cities.")
  if (cities.length > 0) {
    return cities[0].picture_url
  }

  // if not found go to unsplash
  const unsplashResult = await getUnsplashImageByText(input)
  console.log("unsplashResult", unsplashResult)
  if (unsplashResult) {
    return unsplashResult
  }

  return defaultBackground
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const token = await getToken({ req })
  console.log("session token", token)
  const input = req.query.input
  const picture = await getPicture(input)
  if (picture) res.status(200).json({ picture })
  else res.status(400).json(null)
}
