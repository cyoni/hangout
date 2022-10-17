import React, { useEffect, useState } from "react"

interface Props {
  headerExternalClass?: string
  title?: string
  titleExternalClass?: string
  backgroundId?: string
  customImageId?: string
  children?
}
async function getHeaderPicture(input: string) {
  const response = await fetch(`/api/headerPictureApi?input=${input}`)
  const data = await response.json()
  return data.picture
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
          backgroundplaceId || customImageId
            ? backgroundUrl
            : "/static/default-header.jpg"
        }')`,
        backgroundColor: !hasPicture ? "#1e81b0" : "",
        filter: backgroundplaceId && isLoading ? "blur(8px)" : "",
      }}
      className={`relative h-56 
       border border-b-2 border-transparent	
       border-b-red-500 bg-cover bg-center object-fill shadow-xl ${
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
