import { IncomingMessage } from "http"

export function getReferer(req: IncomingMessage): string {
  try {
    const fullReferer = req.headers && req.headers["referer"]
    const editedUrl = fullReferer.replace("//", "")
    const index = editedUrl.indexOf("/")
    return editedUrl.substring(index)
  } catch (err) {
    return ""
  }
}
