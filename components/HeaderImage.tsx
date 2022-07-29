import React, { useEffect, useState } from "react"
import { defaultBackground } from "../lib/consts"
import { getHeaderPicture } from "../lib/headerImage"

interface Props {
  headerExternalClass?: string
  title: string
  titleExternalClass?: string
  backgroundId?: string
}

function HeaderImage({
  title,
  titleExternalClass,
  headerExternalClass,
  backgroundId,
}: Props) {
  console.log("backgroundId", backgroundId)
  const [backgroundUrl, setBackgroundUrl] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await getHeaderPicture(backgroundId)
      setBackgroundUrl(result)
      setIsLoading(false)
    }
    fetchData()
  }, [backgroundId])

  return (
    <div
      style={{
        backgroundImage: `url('${
          backgroundId ? backgroundUrl : defaultBackground
        }')`,
        filter: backgroundId && isLoading ? `blur(8px)` : "",
      }}
      className={`h-40 rounded-sm
       border border-transparent
       bg-cover bg-center shadow-lg ${
         headerExternalClass ? headerExternalClass : ""
       }`}
    >
      <p
        className={`title-shadow mt-12 w-fit 
        pl-4 font-sans text-[40px] 
        font-medium tracking-wide text-white ${
          titleExternalClass ? titleExternalClass : ""
        }`}
      >
        {title}
      </p>
    </div>
  )
}

export default HeaderImage
