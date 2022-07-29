function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

export function unique(array: any[]) {
  return array.filter(onlyUnique)
}


export function convertArrayToDictionary(array: any[], key: string){
    return array.reduce((acc, curr) => ({ ...acc, [curr[key]]: curr}), {}) 
}