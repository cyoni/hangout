import React, { useRef, useState } from "react"

interface Props {
  className: string
  toggleFunction?: Function
}

function LocationAutoComplete({ className, toggleFunction }: Props) {
  const [locations, setLocations] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const inputRef = useRef(null)

  const clearLocations = () => {
    setLocations(null)
  }
  const handleClick = (location) => {
    console.log("location", location)
    const parsedLocation = parseLocation(location)
    inputRef.current.value = parsedLocation
    setUserLocation(parsedLocation)
    toggleFunction?.(location)
    clearLocations()
  }

  const parseLocation = (location) => {
    return `${location.city}, ${location.state}, ${location.country}`
  }

  const renderLocations = () => {
    return (
      <ul className="rounded-md p-1 shadow-lg">
        {locations?.map((location, index) => (
          <li
            key={location.id}
            onClick={() => handleClick(location)}
            className={`cursor-pointer rounded-md  border-b px-2 
          py-1 hover:bg-gray-50 hover:text-blue-500`}
          >
            {parseLocation(location)}
          </li>
        ))}
      </ul>
    )
  }

  const fetchLocation = async (input: string) => {
    if (input) {
      const data = await fetch(`api/locationAutocomplete?location=${input}`)
      const json = await data.json()
      setLocations(json.result)
      console.log("result", json.result)
    }
  }

  const handleChange = (e) => {
    const input: string = e.target.value
    if (input) {
      fetchLocation(e.target.value)
    } else {
      clearLocations()
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        className={className}
        type="text"
        onChange={(e) => handleChange(e)}
      />
      {locations && locations.length > 0 && renderLocations()}
    </>
  )
}

export default LocationAutoComplete
