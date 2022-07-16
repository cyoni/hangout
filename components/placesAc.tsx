import React, { useRef, useState } from "react"

interface Props {
  className: string
  onChange?: Function
  toggleFunction: Function
}

function LocationAutoComplete({ className, onChange, toggleFunction }: Props) {
  const [places, setPlace] = useState<Place[]>(null)
  const [lastInputWithResults, setLastInputWithResults] = useState<string>(null)
  const inputRef = useRef(null)

  const clearLocations = () => {
    setPlace(null)
  }

  const handleClick = (location) => {
    console.log("place", location)
    const parsedLocation = parseLocation(location)
    inputRef.current.value = parsedLocation
    toggleFunction(location)
    clearLocations()
  }

  const parseLocation = (place: Place) => {
    return `${place.city}, ${place.province}, ${place.country}`
  }

  const renderLocations = () => {
    return (
      <div className="relative">
        <ul className="absolute bg-white z-10 top-[-5px] rounded-md p-1 shadow-lg">
          {places?.map((place) => (
            <li
              key={place.city_id}
              onClick={() => handleClick(place)}
              className={`cursor-pointer rounded-md border-b px-2 
                        py-1 hover:bg-gray-50 hover:text-blue-500`}
            >
              {parseLocation(place)}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const fetchLocation = async (input: string) => {
    if (input) {
      const data = await fetch(`api/placesAcApi?input=${input}`)
      if (data.status == 200) {
        const json = await data.json()
        const places: Place[] = json.places
        setPlace(places)
        console.log("result", places)
      }
    }
  }

  const handleChange = (e) => {
    const input: string = e.target.value
    onChange?.(inputRef)

    // if (Array.isArray(places) && places.length > 0) {
    //   setLastInputWithResults(input)
    // }

    // if (Array.isArray(places) && places.length == 0) {
    //   console.log("last fetch was empty, skipping fetch")
    //   return
    // }

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
      {Array.isArray(places) && places.length > 0 && renderLocations()}
    </>
  )
}

export default LocationAutoComplete
