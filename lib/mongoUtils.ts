import { MongoInsertRes, MongoUpdateRes } from "../pages/typings/typings"
import clientPromise from "./mongodb"

export async function dbFind(dbName, query) {
  try {
    console.log("dbName: " + dbName)
    console.log("query: ", query)
    const client = await clientPromise
    const db = client.db()
    const data = await db.collection(dbName).find(query).toArray()
    console.log("data: ", data)
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return { error: error.message }
  }
}

export async function dbAggregate(request: AggregateReq) {
  try {
    const { collection, params } = request
    const client = await clientPromise
    const db = client.db()

    console.log("aggregateParams", params)

    const data = await db.collection(collection).aggregate(params).toArray()

    console.log("dbAggregate data: ", data)
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return { error: error.message }
  }
}

export async function dbInsertMany(
  database: string,
  query: {}
): Promise<MongoInsertRes> {
  try {
    const client = await clientPromise
    const db = client.db()
    return await db
      .collection(database)
      .insertMany(query)
  } catch (e) {
    return { error: e.message }
  }
}

export async function dbInsertOne(
  database: string,
  query: {}
): Promise<MongoInsertOneRes> {
  try {
    const client = await clientPromise
    const db = client.db()
    return await db
      .collection(database)
      .insertOne(JSON.parse(JSON.stringify(query)))
  } catch (e) {
    return { error: e.message }
  }
}

export async function dbUpdateOne(
  database: string,
  filter: {},
  updateDoc: {},
  options: {}
): Promise<MongoUpdateRes> {
  try {
    const client = await clientPromise
    const db = client.db()
    const result = await db
      .collection(database)
      .updateOne(filter, updateDoc, options)
    return result
  } catch (e) {
    return { error: e.message }
  }
}

export async function dbUpdateMany(
  database: string,
  filter: {},
  updateDoc: {},
  options: {}
) {
  try {
    const client = await clientPromise
    const db = client.db()
    const result = await db
      .collection(database)
      .updateMany(filter, updateDoc, options)
    return result
  } catch (e) {
    return { error: e.message }
  }
}
export async function dbDeleteOne(database: string, query) {
  const client = await clientPromise
  const db = client.db()
  const result = await db.collection(database).deleteOne(query)
  return result
}

export function findTwoUsers(user1: string, user2: string) {
  return {
    $or: [
      { $and: [{ user1 }, { user2 }] },
      { $and: [{ user1: user2 }, { user2: user1 }] },
    ],
  }
}
