import React from "react"

interface Props {
  className: string
}
const getLocation = async (input: string) => {
  if (input) {
    const data = await fetch(`api/locationAutocomplete?location=${input}`)
    const json = await data.json()
    console.log("result", json.result)
  }
}

function LocationAutoComplete({ className }: Props) {
  return (
    <input
      className={className}
      type="text"
      onChange={(e) => getLocation(e.target.value)}
    />
  )
}

export default LocationAutoComplete
