import React, { useEffect, useRef, useState } from "react"
// this class is deprecated
interface Props {
  placeholder?: string
  className: string
  onChange?: Function
  position?: string
  toggleFunction: Function
  initialValue?: string
}

function LocationAutoComplete({
  className,
  onChange,
  toggleFunction,
  position,
  placeholder,
  initialValue = "",
}: Props) {
  const [places, setPlace] = useState<Place[]>(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (initialValue) inputRef.current.value = initialValue
  }, [])

  const clearLocations = () => {
    setPlace(null)
  }

  const handleClick = (location) => {
    console.log("place", location)
    const parsedLocation = parseLocation(location)
    inputRef.current.value = parsedLocation
    toggleFunction(location, inputRef)
    clearLocations()
  }

  const parseLocation = (place: Place) => {
    return `${place.city}, ${place.province}, ${place.country}`
  }

  const renderLocations = () => {
    return (
      <div className="relative ">
        <ul
          className={`absolute z-10 max-h-96 overflow-auto rounded-md bg-white p-1 shadow-lg ${
            position ? position : ""
          }`}
        >
          {places?.map((place, i) => (
            <li
              key={place.city_id}
              onClick={() => handleClick(place)}
              className={`cursor-pointer  ${
                places.length - 1 > i ? "border-b" : ""
              }  px-2 py-1 hover:bg-gray-50 hover:text-blue-500`}
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
      const data = await fetch(`/api/placesAcApi?input=${input}`)
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
        placeholder={placeholder}
        type="text"
        //  onBlur={clearLocations}
        onChange={(e) => handleChange(e)}
      />
      {Array.isArray(places) && places.length > 0 && renderLocations()}
    </>
  )
}

export default LocationAutoComplete
