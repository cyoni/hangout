import { createApi } from "unsplash-js"
import * as nodeFetch from "node-fetch"

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS,
  fetch: nodeFetch.default as unknown as typeof fetch,
})

export async function getUnsplashImageByText(input: string) {
  try {
    const data = await unsplash.search.getPhotos({
      query: input,
      page: 1,
    })
    const images = data.response.results
    const picture = images.reduce((max, curr) => max.likes > curr.likes ? max : curr);
    console.log("picturepicturepicture",picture)
    const photoUrl = picture.urls["regular"]
    console.log("photoUrl", photoUrl)
    return photoUrl
  } catch (err) {
    console.log("error", err)
    return null
  }
}
