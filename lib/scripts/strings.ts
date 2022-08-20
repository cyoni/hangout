export function isNullOrEmpty(value: string | number): boolean {
  return (
    value === null ||
    (typeof value === "string" && value.trim() === "")
  )
}

export default function generateRandomString(length: number) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
