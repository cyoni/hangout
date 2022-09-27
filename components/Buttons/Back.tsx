import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import React from "react"

interface Props {
  className: string
  url: string
}
function Back({ className, url }: Props) {
  return (
    <Link href={url}>
      <ArrowLeftIcon
        className={`h-10 p-2 rounded-full text-gray-400 hover:bg-gray-100 cursor-pointer ${
          className ? className : ""
        }`}
      />
    </Link>
  )
}

export default Back
