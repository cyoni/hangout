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
    throw Error("bad request")
  } catch (e) {
    const res: ResponseObject = { isSuccess: false, message: e.message }
    return res
  }
}

export async function get(url, params = null): Promise<any> {
  try {
    const serviceUrl = `${url}?${params}`
    const data = await fetch(serviceUrl, {
      method: "GET",
    })
    if (data.status == 200) {
      const result: ResponseObject = await data.json()
      return result
    }
    throw Error("bad request")
  } catch (e) {
    const res: ResponseObject = { isSuccess: false, message: e.message }
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
