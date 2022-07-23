export async function getHeaderPicture(input: string) {
  const response = await fetch(`../api/headerPictureApi?input=${input}`)
  const data = await response.json()
  return data.picture
}
