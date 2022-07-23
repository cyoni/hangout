export const localStorage = (window, folder) => {
  const data = window.localStorage.getItem(folder)
  if (data) return JSON.parse(data)
  else return null
}
