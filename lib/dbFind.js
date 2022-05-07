import clientPromise from "./mongodb";

export default async function dbFind(dbName, query){
    try {
        const client = await clientPromise;
        const db = client.db();
        const data = await db.collection(dbName).find(query).toArray();
        return JSON.parse(JSON.stringify(data));
      } catch (error) {
        return { error: error.message };
      }
}