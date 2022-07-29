import { post } from "./postman"

export async function queryPlacesFromClient(cityCodes: any[]) {
  return await post({
    url: "api/queryPlacesApi",
    body: { codes: cityCodes },
  })
}
