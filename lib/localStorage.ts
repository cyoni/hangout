export function getValue(key: string) {
  return localStorage.getItem(key)
}

export function setValue(key: string, value: string) {
  console.log("setValue", "key", key, "value", value)
  localStorage.setItem(key, value)
}
