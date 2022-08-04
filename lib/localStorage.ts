export function getValue(key: string) {
  return localStorage.getItem(key)
}

export function setValue(key: string, value: string) {
  localStorage.setItem(key, value)
}
