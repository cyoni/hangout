import * as React from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import { isNullOrEmpty } from "../lib/scripts/strings"

interface Props {
  id?: string
  label: string
  fetchFunction: Function
  getOptionLabel: any
  handleSelect: Function
  isOptionEqualToValue?: any
}
export default function AutoComplete({
  id,
  label,
  fetchFunction,
  getOptionLabel,
  isOptionEqualToValue,
  handleSelect
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<readonly any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [input, setInput] = React.useState<string>("")

  React.useEffect(() => {
    if (isNullOrEmpty(input)) return

    ;(async () => {
      console.log("input", input)
      setLoading(true)
      const data = await fetchFunction(input)
      if (Array.isArray(data)) {
        setOptions(data)
        console.log("result", data)
      }
      setLoading(false)
    })()
  }, [input])

  React.useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <Autocomplete
      id={id}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      onChange={(event, value) => handleSelect(value)}
      autoComplete={true}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
 
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}