import type { NextApiRequest, NextApiResponse } from "next"
import { queryAutoCompletePlace } from "../../lib/Places/placeUtils"

type Response = {
  places: Place[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const input = String(req.query.input)
  const places = await queryAutoCompletePlace(input)
  if (Array.isArray(places)) res.status(200).json({ places })
  else res.status(400).json(places)
}
