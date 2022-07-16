import Link from "next/link"
import React from "react"
import Menubar from "./Menubar"

function Header({ connectedUser }) {
  return (
    <header className="border-b border-gray-100 p-2 pb-3">
      <div className="mx-auto flex items-center justify-between  text-gray-700">
        <div className="flex items-center space-x-4">
          <div className="pl-10">
            <Link href="/">
              <a className="text-3xl font-medium">Hangouts</a>
            </Link>
          </div>
          <div className="rounded-md bg-slate-200 py-2">
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-60 bg-transparent pl-2 outline-none"
            />
          </div>
        </div>

        {connectedUser?.user?.name && (
          <>
            <div>hello {connectedUser.user.name}</div>{" "}
            <Link href="/logout">log out</Link>
          </>
        )}

        <Menubar />
      </div>
    </header>
  )
}

export default Header
