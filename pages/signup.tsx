import { useState } from "react"
import HeaderImage from "../components/Header/HeaderImage"
import { AutoComplete, CustomAutoComplete } from "../components/AutoComplete"
import { getFullPlaceName } from "../lib/consts/place"
import { getCitiesAutoComplete } from "../lib/AutoCompleteUtils"
import GoogleSignInButton from "../components/Buttons/GoogleSignInButton"
import Head from "next/head"
import Loader from "../components/Loaders/Loader"
import useSignIn from "../components/Signin/useSignin"
import { getToken } from "next-auth/jwt"

export default function Signup() {
  const [place, setPlace] = useState<Place>(null)
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false)
  const { SignInUser, signInMutation } = useSignIn()
  const isLoading = signInMutation.isLoading || isRedirecting

  const handleSelect = (place) => {
    setPlace(place)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      placeId: place?.placeId,
    }
    SignInUser(data)
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <HeaderImage title="Sign up" />
      <div className="relative mx-auto mt-20 w-[500px] rounded-md border py-5 shadow-md">
        {isLoading && <Loader />}
        <form
          onSubmit={handleSubmit}
          method="post"
          className="flex flex-col p-2 px-4"
        >
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="text-default my-2 rounded-full border text-gray-400"
            name="name"
            id="name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="text-default my-2 rounded-full border text-gray-400"
            name="email"
            id="email"
          />

          <label htmlFor="dates">Password</label>
          <input
            type="password"
            className="text-default my-2 rounded-full border text-gray-400"
            name="password"
            id="password"
          />

          <label>City</label>
          <AutoComplete
            defaultValue={place}
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelect}
            getOptionLabel={getFullPlaceName}
          />

          <button type="submit" className="btn mx-auto mt-6 w-fit px-10">
            Sign up
          </button>
        </form>

        <div>
          <div className="mx-3 h-10 border-b text-center">
            <span className="relative top-6 bg-white px-5 text-sm text-gray-400">
              Or
            </span>
          </div>
          <GoogleSignInButton
            triggerBeforeSignInAction={() => setIsRedirecting(true)}
          />
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const token = await getToken(context)
  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    }
  }
  return {
    props: {},
  }
}
