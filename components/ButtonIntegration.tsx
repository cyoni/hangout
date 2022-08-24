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
}
export default function ButtonIntegration({
  children,
  onClick,
  externalClass,
  buttonClassName,
  onFinishText,
  disabled,
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
    }
  }

  return (
    <div className={`${externalClass ? externalClass : ""}`}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box className="w-full" sx={{ position: "relative" }}>
          <button
            type="submit"
            className={`btn w-full transition-all duration-500 ${
              buttonClassName ? buttonClassName : ""
            } ${loading ? "text-transparent" : ""} ${
              disabled ? "opacity-60 hover:opacity-60" : ""
            }`}
            disabled={disabled || loading}
            onClick={handleButtonClick}
          >
            {isDone && onFinishText ? onFinishText : children}
          </button>

          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: "white",
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
