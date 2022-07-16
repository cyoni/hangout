import React, { useEffect, useState } from "react"
import { defaultBackground } from "../lib/consts"
import { getHeaderPicture } from "../lib/headerImage"

interface Props {
  headerExternalClass?: string
  title: string
  titleExternalClass?: string
  backgroundId?: string
}

function HeaderWrapper({
  title,
  titleExternalClass,
  headerExternalClass,
  backgroundId,
}: Props) {
  const [backgroundUrl, setBackgroundUrl] = useState<string>()
  useEffect(() => {
    const fetchData = async () => {
      const result = await getHeaderPicture(backgroundId)
      setBackgroundUrl(result)
    }
    fetchData()
  }, [backgroundId])

  return (
    <div
      style={{
        backgroundImage: `url('${
          backgroundId ? backgroundUrl : defaultBackground
        }')`,
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

export default HeaderWrapper
