import { LongWithoutOverridesClass } from "bson"
import { access } from "fs"
import { convertObjectToDictionary } from "./scripts/objects"

export async function post(req: PostRequest): Promise<any> {
  const data = await fetch(req.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  })

  const response = await data.json()

  if (data.status === 200) {
    return response
  }

  return Promise.reject("post - error: " + response?.error?.message)
}

export async function newGet(url, params: {} = null): Promise<any> {
  let ans = ""
  const paramsDictionary = params ? convertObjectToDictionary(params) : []

  const convertedParams = paramsDictionary.reduce(
    (prev, curr) => `${prev}${curr[1] ? `${curr[0]}=${curr[1]}&` : ""}`,
    ""
  )

  console.log("convertedParams", convertedParams)
  const serviceUrl = `${url}?${convertedParams}`
  const data = await fetch(serviceUrl, {
    method: "GET",
  })

  const response = await data.json()

  if (data.status == 200) {
    console.log("JSON", response)
    return response
  }

  throw Error(
    `(newGet) - error, statue: ${data.status}, message: ${response?.error?.message}`
  )
}

export async function get(url, params = null): Promise<ResponseObject> {
  const serviceUrl = `${url}?${params}`
  const data = await fetch(serviceUrl, {
    method: "GET",
  })

  console.log("service url: " + serviceUrl)

  const response = await data.json()

  if (data.status == 200) {
    console.log("JSON", response)
    return { data: response }
  }

  throw Error("(get) - error: " + response?.error?.message)
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
