import { useRouter } from "next/router"
import HeaderImage from "../components/HeaderImage"
import { getCsrfToken, signIn } from "next-auth/react"
import { useState } from "react"
import Loader from "../components/Loader"
import toast from "react-hot-toast"
import Script from "next/script"
import Head from "next/head"
import Image from "next/image"
import { getToken } from "next-auth/jwt"
import GoogleSignInButton from "../components/GoogleSignInButton"

export default function Login({ callbackUrl, session }) {
  const router = useRouter()
  console.log("callbackUrl", callbackUrl)
  const [unauthorized, setUnauthorized] = useState<boolean>(false)
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoggingIn(true)
    setUnauthorized(false)

    const email = e.target.email.value
    const password = e.target.password.value
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    console.log("res", response)

    if (response.status === 200) {
      router.push(callbackUrl)
      toast.success(`Welcome back!`)
    } else {
      setIsLoggingIn(false)
      setUnauthorized(true)
      renderFailureToast()
      console.log("error", response)
    }
  }
  const renderFailureToast = () => {
    toast.error("Email or password is invalid.")
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-[700px]">
        <HeaderImage title="Log in" />
        <div
          className={`shared-frame ${
            unauthorized ? " shadow-xl ring-2 ring-red-600" : ""
          } relative`}
        >
          {isLoggingIn && <Loader />}

          <GoogleSignInButton
            triggerBeforeSignInAction={() => setIsLoggingIn(true)}
          />
          <div className="mx-3 h-10 border-b text-center">
            <span className="relative top-6 bg-white px-5 text-sm text-gray-400">
              Or
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col p-5 "
            method="post"
          >
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="mt-2 rounded-full border px-4 py-2 text-gray-400 outline-none focus:ring-2"
              name="email"
              id="email"
            />

            <label htmlFor="password" className="mt-2">
              Password
            </label>
            <input
              type="password"
              className="mt-2 rounded-full border p-2 px-4 text-gray-400 outline-none focus:ring-2"
              name="password"
              id="password"
            />

            <button
              type="submit"
              className={`mx-auto mt-5 block w-fit rounded-full
              bg-blue-600 px-9 py-1 
              text-lg font-medium text-white
              hover:opacity-80`}
            >
              Log in
            </button>
          </form>
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
  const callbackUrl = context.query.callbackUrl || "/"
  return {
    props: { callbackUrl },
  }
}
