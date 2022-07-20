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
    const {
      collection,
      innerJoin,
      $match,
      $project,
      $count,
      $sort,
    } = request
    const client = await clientPromise
    const db = client.db()

    const aggregateParams = []
    aggregateParams.push({ $match })

    if (innerJoin) {
      aggregateParams.push({
        $lookup: {
          ...innerJoin,
        },
      })
    }

    if ($project) {
      aggregateParams.push({ $project })
    }

    if ($count) {
      aggregateParams.push({ $count })
    }

    if ($sort) {
      aggregateParams.push({ $sort })
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
