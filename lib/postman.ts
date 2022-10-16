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

  return Promise.reject(response)
}

export async function get(url, params: {} = null): Promise<any> {
  const paramsDictionary = params ? convertObjectToDictionary(params) : []
  console.log("params",params)
  console.log("paramsDictionary",paramsDictionary)

  const convertedParams = paramsDictionary.reduce(
    (prev, curr) => `${prev}${curr[1] ? `${curr[0]}=${curr[1]}&` : ""}`,
    ""
  )

  console.log("convertedParams", convertedParams)
  const serviceUrl = `${url}${convertedParams ? "?" + convertedParams : ""}`
  const data = await fetch(serviceUrl, {
    method: "GET",
  })

  const response = await data.json()

  if (data.status == 200) {
    console.log("JSON", response)
    return response
  }

  throw Error(
    `get - error, status: ${data.status}, message: ${response?.error?.message}`
  )
}
