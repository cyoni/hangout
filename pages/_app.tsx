require("dotenv")

import "../styles/globals.scss"
import Link from "next/link"
import Head from "next/head"
import { isUserVarified } from "../lib/jwtUtils"
import { useEffect, useState } from "react"
import Script from "next/script"
import { useRouter } from "next/router"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"
import useOnclickOutside from "react-cool-onclickoutside"

const PlacesAutocomplete = ({ handleClick }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      types: ["locality", "country"],
    },
    debounce: 300,
  })
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions()
  })

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value)
  }

  const handleSelect =
    ({ place_id, description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      console.log("description", description)
      setValue(description, false)
      clearSuggestions()

      if (handleClick) handleClick(description)

      // Get latitude and longitude via utility functions
      // getGeocode({ placeId: place_id }).then((results) => {
      //   console.log("results", results);
      //   const { lat, lng } = getLatLng(results[0]);
      //   console.log("📍 Coordinates: ", { lat, lng });
      // });
    }

  const renderSuggestions = () =>
    data.map((suggestion) => {
      console.log("suggestion", suggestion)
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  // const x = process.env.ACCESS_TOKEN_SECRET;

  const isWindow = typeof window !== "undefined"
  const router = useRouter()

  const handleClick = (data) => {
    console.log("got data: ", data)
    router.push(`places?location=${data}`)
  }

  const localStorage = (folder) => {
    const data = window.localStorage.getItem(folder)
    if (data) return JSON.parse(data)
    else return null
  }

  const [connectedUser, setConnectedUser] = useState("")

  useEffect(() => {
    setIsGooglePlacesReady(true)
    const localUser = localStorage("user")
    if (localUser) {
      const varifiedUser = isUserVarified(localUser.token)
      console.log("varifiedUser", varifiedUser)
      if (varifiedUser) {
        setConnectedUser({ jwt: varifiedUser.jwt, user: varifiedUser.user })
      }
    }
  }, [])

  const [isGooglePlacesReady, setIsGooglePlacesReady] = useState(false)

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2bqs8mGOMr9IT9Z6bs8FvgbmkiSTWSbU&libraries=places"
        strategy="beforeInteractive"
      ></Script>

      <header className="p-2 pb-3 shadow-md">
        <div className="mx-auto flex max-w-[90%] justify-between items-center  text-gray-700">
          <h1>
            <div className="logo">
              <Link href="/">
                <a className="text-3xl font-medium">Hangouts</a>
              </Link>
            </div>
          </h1>
          <div>location: xx</div>
          <div className="flex space-x-2">
            <Link href="/">
              <a className="link">Home</a>
            </Link>
            <Link href="login">
              <a className="link">Login</a>
            </Link>
            <Link href="signup">
              <a className="link">Sign up</a>
            </Link>
            <Link href="publish-hangout">
              <a className="link">Publish hangout</a>
            </Link>
          </div>
          {connectedUser?.user?.name && (
            <>
              <div>hello {connectedUser.user.name}</div>{" "}
              <Link href="/logout">log out</Link>
            </>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-[90%]">
        <Component {...pageProps} connectedUser={connectedUser} />
      </main>
      <footer className="footer">footer</footer>
    </>
  )
}

export default MyApp
