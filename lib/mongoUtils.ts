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
    const { collection, params } =
      request
    const client = await clientPromise
    const db = client.db()

    console.log("aggregateParams", params)

    const data = await db
      .collection(collection)
      .aggregate(params)
      .toArray()

    console.log("dbAggregate data: ", data)
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return { error: error.message }
  }
}

export async function dbInsert(
  database: string,
  query: {}
): Promise<MongoInsertRes> {
  try {
    const client = await clientPromise
    const db = client.db()
    return await db
      .collection(database)
      .insertMany(JSON.parse(JSON.stringify(query)))
  } catch (e) {
    return { error: e.message }
  }
}
