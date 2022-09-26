import { useRouter } from "next/router"
import HeaderImage from "../components/HeaderImage"
import { getCsrfToken, signIn } from "next-auth/react"
import { useState } from "react"
import Loader from "../components/Loader"
import toast from "react-hot-toast"
import Script from "next/script"

export default function Login({ csrfToken, callbackUrl, session }) {
  const router = useRouter()
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
      //router.push(callbackUrl)
      toast.success(`Welcome back!`)
    } else {
      setIsLoggingIn(false)
      setUnauthorized(true)
      renderFailureToast()
      console.log("error", response)
    }
  }
  console.log("csrfToken", csrfToken)

  const renderFailureToast = () => {
    toast.error("Email or password is invalid.")
  }

  function handleCredentialResponse(response) {
    console.log("GOOGLE RESPONSE", JSON.stringify(response))
  }

  return (
    <div className="min-h-[700px]">
      <HeaderImage title="Log in" />
      <div
        className={`shared-frame ${
          unauthorized ? " shadow-xl ring-2 ring-red-600" : ""
        } relative`}
      >
        {isLoggingIn && <Loader />}

        <button className="btn" onClick={() => signIn("google")}>
          Sign in with GOOGLE
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-5 "
          method="post"
        >
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="mt-2 rounded-full border px-4 py-2 text-gray-400 outline-none"
            name="email"
            id="email"
          />

          <label htmlFor="password" className="mt-2">
            Password
          </label>
          <input
            type="password"
            className="mt-2 rounded-full border p-2 px-4 text-gray-400 outline-none"
            name="password"
            id="password"
          />

          <button
            type="submit"
            className={`mt-5 rounded-full 
              bg-blue-600 px-2 py-1 
              text-lg font-medium text-white
              hover:opacity-80`}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}
export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  const callbackUrl = context.query.callbackUrl || "/"
  return {
    props: { csrfToken, callbackUrl },
  }
}
