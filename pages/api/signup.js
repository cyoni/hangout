// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbFind from "../../lib/dbFind";
import clientPromise from "../../lib/mongodb";
import randomString from "../../lib/randomString";
import { generateAccessToken } from "../../lib/jwtUtils";
import { Client } from "@googlemaps/google-maps-services-js";

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

const getValueFromAddress = (addressComponents, type) => {
  for (let i = 0; i < addressComponents.length; i++) {
    if (addressComponents[i].types.includes(type)) {
      return addressComponents[i].long_name;
    }
  }
};

async function signup(req) {
  try {
    const client = new Client({});

    const mongoClient = await clientPromise;
    const db = mongoClient.db();

    console.log("req.body", req.body);

    const { placeId, name, email, password } = req.body;

    // check if place id is valid

    const location = await client
      .geocode({
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
        console.log("result", r.data.results[0]);
        const addressComponents = r.data.results[0].address_components;

        const country = getValueFromAddress(addressComponents, "country");
        const state = getValueFromAddress(
          addressComponents,
          "administrative_area_level_1"
        );
        const city = getValueFromAddress(addressComponents, "locality");

        console.log("country", country);
        console.log("state", state);
        console.log("city", city);
        const formatted_address = r.data.results[0].formatted_address;
        const latLng = r.data.results[0].geometry.location;

        return { country, state, city, formatted_address, latLng };
      })
      .catch((e) => {
        console.log(e.response.data.error_message);
      });

    console.log("location", location);

    // const user = await findUser(db, req.body);
    // if (user?.length > 0) {
    //   return { error: true, message: "user exists" };
    // }

    const newUser = { name, password, email, location };
    console.log("newUser", newUser);
    await addUser(db, newUser);

    // generate JWT:
    const token = generateAccessToken({ userId: 12345 });

    window.localStorage.setItem("user", JSON.stringify({ userId, token }));

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
