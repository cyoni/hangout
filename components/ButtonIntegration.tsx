import * as React from "react"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

interface Props {
  buttonText: string
  onClick: Function
  externalClass?: string
  buttonClassName?: string
  disabled?: boolean
}
export default function ButtonIntegration({
  buttonText,
  onClick,
  externalClass,
  buttonClassName,
  disabled,
}: Props) {
  const [loading, setLoading] = React.useState(false)

  const handleButtonClick = async (e) => {
    e?.preventDefault()
    if (!loading) {
      setLoading(true)
      await onClick()
      setLoading(false)
    }
  }

  return (
    <div className={`${externalClass ? externalClass : ""}`}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box className="w-full" sx={{ m: 1, position: "relative" }}>
          <button
            type="submit"
            className={`btn w-full ${buttonClassName ? buttonClassName : ""} ${
              loading ? "text-transparent" : ""
            } ${disabled ? "opacity-60 hover:opacity-60" : ""}`}
            disabled={disabled || loading}
            onClick={handleButtonClick}
          >
            {buttonText}
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
