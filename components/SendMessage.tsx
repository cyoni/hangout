import { TextField } from "@mui/material"
import React from "react"
import ButtonIntegration from "./ButtonIntegration"

function SendMessage() {
  return (
    <div className="mt-5 w-full">
        <div className="text-3xl">
        Send Message To Yoni
        </div>
      <div className="flex flex-col my-10">
  

        <TextField id="outlined-basic" label="Message" variant="outlined" rows={8} multiline />
      </div>

      <ButtonIntegration buttonClassName="btn">Send Message</ButtonIntegration>
    </div>
  )
}

export default SendMessage
