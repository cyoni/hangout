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

export async function dbAggregate(request) {
  try {
    const { database, from, localField, foreignField, as, $match } = request
    const client = await clientPromise
    const db = client.db()
    const data = await db
      .collection(database)
      .aggregate([
        { $match },
        {
          $lookup: {
            from,
            localField,
            foreignField,
            as,
          },
        },
      ])
      .toArray()

    console.log("dbAggregate data: ", data)
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return { error: error.message }
  }
}
