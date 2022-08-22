import React, { useEffect, useState } from "react"
import { defaultBackground } from "../lib/consts"
import { getHeaderPicture } from "../lib/headerImage"

interface Props {
  headerExternalClass?: string
  title: string
  titleExternalClass?: string
  backgroundId?: string
  children
}

function HeaderImage({
  title,
  titleExternalClass,
  headerExternalClass,
  backgroundId,
  children,
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
      className={`h-56 rounded-sm relative
       border border-transparent object-fill	
       bg-cover bg-center shadow-lg ${
         headerExternalClass ? headerExternalClass : ""
       }`}
    >
      <p
        className={`title-shadow mt-20 w-fit 
        pl-4 font-sans text-[40px] 
        font-medium tracking-wide text-white ${
          titleExternalClass ? titleExternalClass : ""
        }`}
      >
        {title}
      </p>
      {children}
    </div>
  )
}

export default HeaderImage
