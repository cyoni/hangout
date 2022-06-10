// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbFind from "../../lib/dbFind";
import clientPromise from "../../lib/mongodb";
import randomString from "../../lib/randomString";
import { generateAccessToken } from "../../lib/jwtUtils";

async function findUser(db, { email }) {
  console.log("email: ", email);
  const user = await db.collection("users").find({ email: email }).toArray();
  return user;
}

async function addUser(db, params) {
  const userId = randomString(10);
  console.log(userId);
  const user = await dbFind("users", { userId });
  if (!user || user.length === 0) {
    const newUser = { userId, ...params };
    await db.collection("users").insertOne(JSON.parse(JSON.stringify(newUser)));
  }
}

async function signup(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    console.log("req.body", req.body);

    const user = await findUser(db, req.body);
    if (user?.length > 0) {
      return { error: true, message: "user exists" };
    }

    // await addUser(db, req.body);

    // generate JWT:
    const token = generateAccessToken({ userId: 12345 });

    window.localStorage.setItem(
      "user",
      JSON.stringify({ userId, token })
    );

    // send JWT to user:

    return { isSuccess: true, jwt: token };
  } catch (error) {
    console.log("error", error.message);
    return { error: true, message: error.message };
  }
}

export default async function handler(req, res) {
  const body = req.body;
  const result = await signup(req);
  if (result?.isSuccess) res.status(200).json(result);
  else res.status(400).json(result);
}
