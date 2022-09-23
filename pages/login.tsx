import { useRouter } from "next/router"
import HeaderImage from "../components/HeaderImage"
import { getCsrfToken, signIn } from "next-auth/react"
import { useState } from "react"
import Loader from "../components/Loader"
import toast from "react-hot-toast"

export default function Login({ csrfToken, callbackUrl, session }) {
  const router = useRouter()
  const [unathorized, setUnathorized] = useState<boolean>(false)
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoggingIn(true)
    setUnathorized(false)

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
      //window.location = callbackUrl
      toast.success(`Welcome back!`)
    } else if (response.status === 401) {
      setIsLoggingIn(false)
      setUnathorized(true)
      renderFailureToast()
    } else {
      console.log("error", response)
    }
  }
  console.log("csrfToken", csrfToken)

  const renderFailureToast = () => {
    toast.error("Email or password is invalid.")
  }

  return (
    <div>
      <HeaderImage title="Log in" />
      session status: {session?.status}
      <div
        className={`shared-frame ${
          unathorized ? " shadow-red-500 shadow-sm border-red-500" : ""
        } relative`}
      >
        {isLoggingIn && <Loader />}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-5 "
          method="post"
        >
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="px-4 mt-2 rounded-full border py-2 text-gray-400 outline-none"
            name="email"
            id="email"
          />

          <label htmlFor="password" className="mt-2">
            Password
          </label>
          <input
            type="password"
            className="px-4 mt-2 rounded-full border p-2 text-gray-400 outline-none"
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
