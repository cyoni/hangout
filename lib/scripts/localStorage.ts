interface localStorageRes {
  data: {}
  ttl: number
}

export function deleteValue(key: string): boolean {
  const value = localStorage.getItem(key)
  localStorage.removeItem(key)
  console.log("deleteValue: removed key", key)
  return value !== null
}
export function getValue(key: string) {
  const now = Date.now()
  const value = localStorage.getItem(key)
  if (!value) return null
  const json: localStorageRes = JSON.parse(value)
  if (json.ttl !== 0 && now > json.ttl) {
    deleteValue(key)
    return null
  }
  console.log("localStorage value", json)
  return json.data
}

export function setValue(key: string, data: string, ttl: number = 0) {
  console.log("setValue", "key", key, "value", data, "ttl", ttl)
  const objectToSave = { data, ttl: ttl > 0 ? Date.now() + ttl : 0 }
  localStorage.setItem(key, JSON.stringify(objectToSave))
}
