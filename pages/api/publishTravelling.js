// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb";

async function addHangout(params) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const data = { userId: 12345, ...params };
    await db
      .collection("future_travelling")
      .insertOne(JSON.parse(JSON.stringify(data)));
    return true;
  } catch (error) {
    console.log("error", error.message);
    return false; // return {error: true, message: err.message}
  }
}

export default async function handler(req, res) {
  const body = req.body;
  const result = await addHangout(req.body);
  if (result) res.status(200).json({ data: `${JSON.stringify(body)}` });
  else res.status(400);
}
