import * as React from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import { isNullOrEmpty } from "../lib/scripts/strings"

interface Props {
  id?: string
  label?: string
  fetchFunction: Function
  getOptionLabel: any
  handleSelect: Function
  isOptionEqualToValue?: any
  placeholder?: string
  disableUnderline?: boolean
  disableClearable?: boolean
  defaultValue?: string
  className?: string
  variant?: any
}

export const CustomAutoComplete = (
  {
    id,
    label,
    fetchFunction,
    getOptionLabel,
    isOptionEqualToValue,
    handleSelect,
    placeholder,
    disableUnderline,
    disableClearable,
    defaultValue,
    className,
    variant = "outlined",
  }: Props,
  ref
) => {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<readonly any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [input, setInput] = React.useState<string>("")

  React.useImperativeHandle(ref, () => ({
    setAutoCompleteValue(value) {
      console.log("setAutoCompleteValue", value)
      setInput(value)
    },
  }))

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
    <Autocomplete // Mui auto complete
      id={id}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      defaultValue={defaultValue}
      disableClearable={disableClearable}
      onChange={(event, value) => handleSelect(value)}
      autoComplete={true}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      freeSolo={true}
      onInputChange={(e, v, r) => setInput(v)}
      inputValue={input}
      className={className}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          label={label}
          variant={variant}
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            ...params.InputProps,
            disableUnderline,
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

export const AutoComplete = React.forwardRef(CustomAutoComplete)
