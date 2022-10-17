import { isNullOrEmpty } from "./strings"

export const formatDate = (date) => {
  if (isNullOrEmpty(date)) return undefined
  let d = new Date(date)
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d)
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)
  const result = `${mo}/${da}/${ye}`
  console.log("input", date)
  console.log("date format resukt", result)
  return result
}
