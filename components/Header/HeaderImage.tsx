import React, { useEffect, useState } from "react"
import { getHeaderPicture } from "../../lib/headerImage"

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
      setBackgroundUrl(
        `${process.env.PICTURES_SERVICE_ENDPOINT}/${customImageId}`
      )
    }
  }, [customImageId])

  const hasPicture = backgroundCityId || customImageId

  return (
    <div
      style={{
        backgroundImage: `url('${
          backgroundCityId || customImageId ? backgroundUrl : "/static/default-header.jpg"
        }')`,
        backgroundColor: !hasPicture ? "#1e81b0" : "",
        filter: backgroundCityId && isLoading ? "blur(8px)" : "",
      }}
      className={`relative h-56 
       border border-transparent bg-cover	
       bg-center object-fill shadow-xl border-b-red-500 border-b-2 ${
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
