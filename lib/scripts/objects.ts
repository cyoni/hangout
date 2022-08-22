export function convertObjectToDictionary(object: Object) {
  return Object.entries(object)
}

export function getObjectKeys(object: Object) {
  return object ? Object.keys(object) : []
}
