import { signIn } from "next-auth/react"
import Image from "next/image"
import React from "react"

function GoogleSignInButton({ triggerBeforeSignInAction }) {
  return (
    <button
      className="mx-auto mt-10 block rounded-md border py-1 pl-2 pr-3 hover:bg-gray-50 focus-within:outline "
      onClick={() => {
        triggerBeforeSignInAction?.()
        signIn("google")
      }}
    >
      <div className="flex items-center gap-1">
        <Image
          height={40}
          width={40}
          alt="Google"
          src="/static/images/google-icon.webp"
        />
        <span className="text-lg font-semibold text-gray-700">
          Sign in with Google
        </span>
      </div>
    </button>
  )
}

export default GoogleSignInButton
