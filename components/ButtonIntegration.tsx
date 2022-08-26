import * as React from "react"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

interface Props {
  onClick: Function
  externalClass?: string
  buttonClassName?: string
  disabled?: boolean
  onFinishText?: string | JSX.Element
  children: string | JSX.Element
  callback?: Function
  circularProgressColor?: string
}
export default function ButtonIntegration({
  children,
  onClick,
  externalClass,
  buttonClassName,
  onFinishText,
  disabled,
  callback,
  circularProgressColor,
}: Props) {
  const [loading, setLoading] = React.useState(false)
  const [isDone, setIsDone] = React.useState(false)

  const handleButtonClick = async (e) => {
    e?.preventDefault()
    if (!loading) {
      setLoading(true)
      await onClick()
      setLoading(false)
      setIsDone(true)
      callback?.()
    }
  }

  return (
    <div className={`${externalClass ? externalClass : ""}`}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box className="w-full" sx={{ position: "relative" }}>
          <button
            type="submit"
            className={`w-full transition-all duration-500 ${
              buttonClassName ? buttonClassName : ""
            } ${disabled ? ` ${loading ? "bg-transparent" : ""}` : ""}`}
            disabled={disabled || loading}
            onClick={handleButtonClick}
          >
            {isDone && onFinishText ? (
              onFinishText
            ) : (
              <div className={`${loading ? "text-transparent" : ""}`}>
                {children}
              </div>
            )}
          </button>

          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: circularProgressColor ?? "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </Box>
    </div>
  )
}
