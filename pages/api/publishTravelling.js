// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "../../lib/mongodb";
import { isUserVarified } from "../../lib/jwtUtils";

async function addTravel(params) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // varify user
    const userAuth = isUserVarified(params.jwt);
    console.log("userAuth", userAuth.isSuccess);

    const dataToDb = {
      userId,
      startDate,
      endDate,
      country,
      state,
      city,
      description,
    } = params;

    if (userAuth?.isSuccess) {
      const data = [{ ...dataToDb }];
      await db
        .collection("future_travelling")
        .insertMany(JSON.parse(JSON.stringify(data)));
      return { isSuccess: true, message: "post has been published!" };
    }
    return { isSuccess: false, message: "auth error." };
  } catch (error) {
    return { isSuccess: false, message: error.message };
  }
}

export default async function handler(req, res) {
  const result = await addTravel(req.body);
  if (result.isSuccess) res.status(200).json(result);
  else res.status(400).json(result);
}
