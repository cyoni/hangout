function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

export function unique(array: any[]) {
  return array.filter(onlyUnique)
}

export function convertStringArrToNumber(array: string[]): number[] {
  return Array.isArray(array) ? array.map((str) => Number(str)) : []
}

export function getDifference(a, b) {
  return a.filter(element => {
    return !b.includes(element);
  });
}

export function convertArrayToDictionary(array: any[], key: string) {
  return array.reduce((acc, curr) => ({ ...acc, [curr[key]]: curr }), {})
}
