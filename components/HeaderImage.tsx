import React, { useEffect, useState } from "react"
import { defaultBackground } from "../lib/consts"
import { getHeaderPicture } from "../lib/headerImage"

interface Props {
  headerExternalClass?: string
  title?: string
  titleExternalClass?: string
  backgroundId?: string
  customImageId?: string
  children
}

function HeaderImage({
  title,
  titleExternalClass,
  headerExternalClass,
  backgroundId: backgroundCityId,
  customImageId,
  children,
}: Props) {
  const [backgroundUrl, setBackgroundUrl] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await getHeaderPicture(backgroundCityId)
      setBackgroundUrl(result)
      setIsLoading(false)
    }
    if (backgroundCityId) fetchData()
  }, [backgroundCityId])

  useEffect(() => {
    if (customImageId) {
      console.log(
        "${process.env.PICTURES_SERVICE_ENDPOINT}/${customImageId}",
        `${process.env.PICTURES_SERVICE_ENDPOINT}/${customImageId}`
      )
      setBackgroundUrl(
        `${process.env.PICTURES_SERVICE_ENDPOINT}/${customImageId}`
      )
    }
  }, [customImageId])

  return (
    <div
      style={{
        backgroundImage: `url('${
          backgroundCityId || customImageId ? backgroundUrl : defaultBackground
        }')`,
        filter: backgroundCityId && isLoading ? `blur(8px)` : "",
      }}
      className={`relative h-56 rounded-sm
       border border-transparent bg-cover	
       bg-center object-fill shadow-lg ${
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
