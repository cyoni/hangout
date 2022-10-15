export function isNullOrEmpty(value: any): boolean {
  return (
    value == null ||
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

export const getSafeString = (input: string): string => {
  input = input.trim()
  if (input && input.length > 20) return null
  const onlyLettersPattern = /[^a-zA-Z\s]+/g
  input = input.replace(onlyLettersPattern, "")
  console.log("input", input)
  return input
}