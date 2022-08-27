import { access } from "fs"
import { convertObjectToDictionary } from "./scripts/objects"

export async function post(req: PostRequest): Promise<any> {
  try {
    const data = await fetch(req.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    })
    if (data.status == 200) {
      const result: ResponseObject = await data.json()

      return result
    }
    throw Error("(post) - bad request")
  } catch (e) {
    const res = { error: e.message }
    return res
  }
}

export async function newGet(url, params: {} = null): Promise<ResponseObject> {
  try {
    let ans = ""
    const paramsDictionary = convertObjectToDictionary(params)

    const convertedParams = paramsDictionary.reduce(
      (prev, curr) => `${prev}${curr[1] ? `${curr[0]}=${curr[1]}&` : ""}`,
      ""
    )

    console.log("convertedParams", convertedParams)
    const serviceUrl = `${url}?${convertedParams}`
    const data = await fetch(serviceUrl, {
      method: "GET",
    })
    if (data.status == 200) {
      const json = await data.json()
      console.log("JSON", json)
      return json
    }
    const json = await data.json()
    throw Error(`(newGet) - bad request, statue: ${data.status}, json: ${JSON.stringify( json)}`)
  } catch (e) {
    const res: ResponseObject = { error: e.message }
    return res
  }
}

export async function get(url, params = null): Promise<ResponseObject> {
  try {
    const serviceUrl = `${url}?${params}`
    const data = await fetch(serviceUrl, {
      method: "GET",
    })
    if (data.status == 200) {
      const json = await data.json()
      console.log("JSON", json)
      return { data: json }
    }
    throw Error("(get) - bad request")
  } catch (e) {
    const res: ResponseObject = { error: e.message }
    return res
  }
}

export async function firePost(url: string, body: {}): Promise<any> {
  //try {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  // } catch (e) {
  //   const res: ResponseObject = { isSuccess: false, message: e.message }
  //   return res
  // }
}
