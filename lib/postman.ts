export async function post(req: PostRequest): Promise<any> {
  try {
    const data = await fetch(req.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    })
    const result: ResponseObject = await data.json()
    return result
  } catch (e) {
    const res: ResponseObject = { isSuccess: false, message: e.message }
    return res
  }
}
