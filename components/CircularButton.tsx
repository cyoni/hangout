import { ChatIcon } from "@heroicons/react/outline"
import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import React, { Fragment, useState } from "react"
import { isNullOrEmpty } from "../lib/scripts/strings"

interface Props {
  onClick?: Function
  tooltip?: string
  circularProgressColor?: string
  children: JSX.Element
  callback?: Function
}
function CircularButton({
  onClick,
  tooltip,
  circularProgressColor,
  children,
  callback,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const handleClick = async () => {
    setLoading(true)
    await onClick()

    setLoading(false)
    callback?.()
  }

  const renderButton = () => (
    <IconButton onClick={handleClick}>{children}</IconButton>
  )

  const ButtonCom = () => {
    console.log("tooltip", tooltip)
    if (!isNullOrEmpty(tooltip)) {
      return <Tooltip title={tooltip}>{renderButton()}</Tooltip>
    } else {
      return renderButton()
    }
  }

  return (
    <div className="relative min-h-[40px] min-w-[40px]">
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: circularProgressColor ?? "blue",
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-14px",
          }}
        />
      ) : (
        <ButtonCom />
      )}
    </div>
  )
}

export default CircularButton
