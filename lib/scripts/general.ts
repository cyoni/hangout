import moment from "moment"

export function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export function getPastTime(timestamp: number): string {
  return timestamp > 0 ? moment(timestamp).fromNow() : ""
}
