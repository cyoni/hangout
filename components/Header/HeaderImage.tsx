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
  backgroundId: backgroundplaceId,
  customImageId,
  children,
}: Props) {
  const [backgroundUrl, setBackgroundUrl] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await getHeaderPicture(backgroundplaceId)
      setBackgroundUrl(result)
      setIsLoading(false)
    }
    if (backgroundplaceId) fetchData()
  }, [backgroundplaceId])

  useEffect(() => {
    if (customImageId) {
      setBackgroundUrl(
        `${process.env.PICTURES_SERVICE_ENDPOINT}/${customImageId}`
      )
    }
  }, [customImageId])

  const hasPicture = backgroundplaceId || customImageId

  return (
    <div
      style={{
        backgroundImage: `url('${
          backgroundplaceId || customImageId ? backgroundUrl : "/static/default-header.jpg"
        }')`,
        backgroundColor: !hasPicture ? "#1e81b0" : "",
        filter: backgroundplaceId && isLoading ? "blur(8px)" : "",
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
