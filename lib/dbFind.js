import clientPromise from "./mongodb";

export default async function dbFind(dbName, query) {
  try {
    console.log("dbName: " + dbName)
    console.log("query: ", query);
    const client = await clientPromise;
    const db = client.db();
    const data = await db.collection(dbName).find(query).toArray();
    console.log("data: ", data)
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    return { error: error.message };
  }
}
