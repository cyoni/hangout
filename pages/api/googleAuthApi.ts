export default async function handler(req, res) {
  const body = req.body
  console.log("GOOGLE AUTH API", JSON.stringify(body))
  res.status(200)
}
