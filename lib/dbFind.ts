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

interface AggregateReq {
  collection: string
  $match: {}
  from?: string
  localField?: string
  foreignField?: string
  as?: string
  $project: {}
}

export async function dbAggregate(request: AggregateReq) {
  try {
    const { collection, from, localField, foreignField, as, $match, $project } =
      request
    const client = await clientPromise
    const db = client.db()

    const aggregateParams = []
    aggregateParams.push({ $match })

    if (from) {
      aggregateParams.push({
        $lookup: {
          from,
          localField,
          foreignField,
          as,
        },
      })
    }

    if ($project) {
      aggregateParams.push({ $project })
    }

    console.log("aggregateParams", aggregateParams)

    const data = await db
      .collection(collection)
      .aggregate(aggregateParams)
      .toArray()

    console.log("dbAggregate data: ", data)
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return { error: error.message }
  }
}
