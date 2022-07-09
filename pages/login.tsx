import { useRouter } from "next/router"

export default function Login() {
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    const JSONdata = JSON.stringify(data)
    const endpoint = "api/loginApi"

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    }

    const response = await fetch(endpoint, options)
    const result = await response.json()
    console.log("response", result)

    if (result.isSuccess) {
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          userId: result.userId,
          name: result.name,
          token: result.token,
          place: result.place,
        })
      )
      window.location = "/"
    } else {
      console.log("could not login in, try again")
    }
  }

  return (
    <div className="mx-auto mt-20 w-[500px] rounded-md border shadow-md">
      <h1 className="mt-2 text-center text-3xl">Log in</h1>
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
  )
}
