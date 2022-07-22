import { useRouter } from "next/router"
import HeaderImage from "../components/HeaderImage"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"

export default function Login({ csrfToken, callbackUrl }) {
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    console.log("res", response)

    if (response.status === 200) {
      window.location = callbackUrl
    } else {
      console.log("could not login in, try again")
    }

    // const data = {
    //   email: e.target.email.value,
    //   password: e.target.password.value,
    //   csrfToken,
    // }

    // const JSONdata = JSON.stringify(data)
    // const endpoint = "/api/auth/callback/credentials"

    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSONdata,
    // }

    // const response = await fetch(endpoint, options)
  }
  console.log("csrfToken", csrfToken)
  const session = useSession()

  return (
    <div>
      <HeaderImage title="Log in" />
      session status: {session.status}
      <div className="shared-frame">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-5 "
          method="post"
        >
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="mt-2 rounded-full border p-2 text-gray-400 outline-none"
            name="email"
            id="email"
          />

          <label htmlFor="password" className="mt-2">
            Password
          </label>
          <input
            type="password"
            className="mt-2 rounded-full border p-2 text-gray-400 outline-none"
            name="password"
            id="password"
          />

          <button
            type="submit"
            className="mt-5 rounded-full bg-blue-600 px-2 py-1 
          text-lg font-medium text-white
          hover:opacity-80"
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
  console.log("contextcontext",context)
  const callbackUrl = context.query.callbackUrl || "/"
  console.log("xxxxxxxxxxxx", callbackUrl)
  return {
    props: { csrfToken, callbackUrl },
  }
}
