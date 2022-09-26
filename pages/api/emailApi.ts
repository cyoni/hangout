import { SEND_SIGN_UP_EMAIL } from "./../../lib/consts"
import { NextApiRequest, NextApiResponse } from "next"

import { isNullOrEmpty } from "../../lib/scripts/strings"
import xx from "node-mailjet"

export function sendSignUpEmail({ email }) {
  if (isNullOrEmpty(email)) return { error: "email is null or empty" }
  const mailjet = xx.Request. connect(
    "cc8e8b1ff4a9e95698d25c20171dce38",
    "5281a4cf49cfb844b9ff0fb766534f09"
  )
  const content =
    "Welcome to Hangouts! Please click the link below to authenticate your account. "

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: email,
          Name: "User",
        },
        To: [
          {
            Email: "cyoni10@gmail.com",
            Name: "Yonmi",
          },
        ],
        Subject: "Link verification for Hangouts",
        TextPart: "My first Mailjet email",
        HTMLPart: content,
        CustomID: "AppGettingStartedTest",
      },
    ],
  })

  request
    .then((result) => {
      console.log("email service", result.body)
      return { message: "email was sent successfully!" }
    })
    .catch((err) => {
      console.log("email service error:", err.statusCode)
      return { error: err.statusCode }
    })
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    let result = null
    const { method } = req.body || req.query

    switch (method) {
      case SEND_SIGN_UP_EMAIL:
        result = await sendSignUpEmail(req.body)
        break
    }

    if (!result || result.error) res.status(400).json({ error: result.error })
    res.status(200).json(result)
  } catch (e) {
    console.log("ERROR ", e.message)
    res.status(500).json({ error: e.message })
  }
}
