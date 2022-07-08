import { isUserVarified } from "../../lib/jwtUtils";
import dbFind from "../../lib/dbFind";

async function profileInfo(userId) {
  const rawResult = await dbFind("users", { userId });
  const filteredResult = rawResult[0].location
  console.log("filteredResult",filteredResult)
  return { isSuccess: true, data: filteredResult };
}

export default async function handler(req, res) {
  const query = req.query;
  const { userId, path } = query
  let result = null
  if (path === "profileInfo") {
    result = await profileInfo(userId);
  }

  //const x = isUserVarified("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1LCJpYXQiOjE2NTM3NTAwMTksImV4cCI6MTY1MzgzNjQxOX0.NFpYEVtNwO8d6qAtCy6fms6R0ABjVcaVm_3xjjbnFLM")
  // console.log("x", x)

  if (result?.isSuccess) res.status(200).json(result);
  else res.status(400).json(result);
}
