import { queryPlaces } from "../../lib/place"

export default async function handler(req, res) {
  try {
    //const token = await getToken({ req })
    // if (!token) res.status(400)
    // const senderId = token.userId
    console.log("###")
    const { codes } = req.body
    console.log("codescodes",codes)

    if (Array.isArray(codes) && codes.length > 0) {
      const result = await queryPlaces(codes)
      if (result) res.status(200).json(result)
    } else throw Error("request invalid")
  } catch (e) {
    res.status(400).json(JSON.stringify(e.message))
  }
}
