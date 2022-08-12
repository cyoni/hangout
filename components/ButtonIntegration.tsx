import * as React from "react"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

interface Props {
  buttonText: string
  onClick: Function
  externalClass?: string
  buttonClassName?: string
}
export default function ButtonIntegration({
  buttonText,
  onClick,
  externalClass,
  buttonClassName,
}: Props) {
  const [loading, setLoading] = React.useState(false)

  const handleButtonClick = async () => {
    if (!loading) {
      setLoading(true)
      await onClick()
      setLoading(false)
    }
  }

  return (
    <div className={`${externalClass ? externalClass : ""}`}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ m: 1, position: "relative" }}></Box>
        <Box sx={{ m: 1, position: "relative" }}>
          <button
            className={`btn ${buttonClassName ? buttonClassName : ""} ${
              loading ? "text-transparent" : ""
            }`}
            disabled={loading}
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
